import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { CacheService } from './Cache.service';
import { ConnectAppRequest, WSEvent } from '../types';
import { inject, injectable } from 'tsyringe';
import * as https from 'https';
import * as http from 'http';
import { CancelationToken, readChunks } from '../utils';
import {
  AppType,
  MAX_WS_RECONNECT_TIMES,
  WS_CLOSE_REASON_RETRY,
  WS_CLOSE_REASON_TERMINATE,
} from '../constants';
import { BadRequest, InternalServerError } from '../Error';
import * as WebSocket from 'ws';
import * as chalk from 'chalk';

@injectable()
export class ExternalApiService {
  private fetch: AxiosInstance | null = null;
  public appType: AppType | null = null;

  public wsClient: WebSocket | null = null;
  public connected = false;

  public reconnectWsTries = MAX_WS_RECONNECT_TIMES;

  constructor(@inject(CacheService) private cacheService: CacheService) {}
  /**
   * Setup service for particular application
   * Each application has its own API service, credentials, token ,etc
   * So this service has per-instance lifecycle
   * @param connetConfig
   * @param appType
   */
  public async setup(connetConfig: ConnectAppRequest, appType: AppType) {
    this.appType = appType;
    this.reconnectWsTries = 5;

    this.cacheService.setAppCredentials(connetConfig, appType);

    //todo ws
    const appBase = this.cacheService.getAppBaseUrl(appType);

    await this.createWs();
    this.fetch = axios.create({
      baseURL: appBase,
    });

    this.fetch.interceptors.request.use(async (conf) => {
      const token = await this.receiveToken();
      conf.headers = {
        ...conf.headers,
        Authorization: token,
      } as AxiosRequestHeaders;
      return conf;
    });
  }

  public async createWs() {
    if (this.appType === null) throw new Error('WS connect: unknown app type');
    const appBase = this.cacheService.getAppBaseUrl(this.appType);
    const url = new URL(appBase);
    const port = url.port ? `:${url.port}` : '';
    const token = await this.receiveToken();
    const wssUrl = `wss://${url.hostname}${port}/callcontrol/ws`;
    const wsClient = new WebSocket(wssUrl, {
      headers: { Authorization: token },
    });
    this.wsClient = wsClient;
    return wsClient;
  }

  public restoreTries = () => {
    this.reconnectWsTries = MAX_WS_RECONNECT_TIMES;
  };

  public reconnectWs(): Promise<WebSocket> {
    return new Promise((res, rej) => {
      if (this.connected === true && this.reconnectWsTries > 0) {
        this.wsClient?.terminate();
        setTimeout(() => {
          this.reconnectWsTries--;
          console.warn(chalk.yellow('🍌 Trying to reconnect websocket...'));
          this.createWs()
            .then((ws) => {
              res(ws);
            })
            .catch(() => {
              rej(WS_CLOSE_REASON_RETRY);
            });
        }, 5000);
      } else {
        rej(WS_CLOSE_REASON_TERMINATE);
      }
    });
  }

  disconnect() {
    if (this.appType !== null) {
      this.wsClient?.close();
      this.cacheService.clearCache(this.appType);
      this.connected = false;
    }
  }
  /**
   * API connect for recieve or refresh (if cash or token expired) access_token
   * @returns
   */
  private async receiveToken() {
    if (this.appType === null) {
      throw new BadRequest('App not configured');
    }
    const token = this.cacheService.getAppAccessToken(this.appType);
    if (!token) {
      const appId = this.cacheService.getAppId(this.appType);
      const appSecret = this.cacheService.getAppSecret(this.appType);
      if (!appId || !appSecret) {
        throw new BadRequest('Application ID or Secret are not defined');
      }
      try {
        const uninterceptedAxiosInstance = axios.create({
          baseURL: this.cacheService.getAppBaseUrl(this.appType),
        });
        const formParams: {
          append(param: string, value?: string): unknown;
        } = new FormData();
        formParams.append('client_id', appId);
        formParams.append('client_secret', appSecret);
        formParams.append('grant_type', 'client_credentials');

        const resp = await uninterceptedAxiosInstance.post('/connect/token', formParams, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.cacheService.setAppAccessToken(this.appType, resp.data.access_token);
        return this.cacheService.getAppAccessToken(this.appType)!;
      } catch (err) {
        console.error('❌', chalk.red(err));
        throw new InternalServerError('Unable to receive access token');
      }
    }
    return token;
  }

  public getFullInfo() {
    return this.fetch!.get('/callcontrol');
  }
  /**
   * API POST Audio stream (made with native node http/https clients because of complexity)
   * @param source
   * @param participantId
   * @param body
   * @returns
   */
  public async postAudioStream(
    source: string,
    participantId: number,
    body: ReadableStream<unknown>,
    cancelationToken: CancelationToken,
  ) {
    const controller = new AbortController();
    const signal = controller.signal;
    const url = '/callcontrol' + `/${source}` + '/participants' + `/${participantId}` + '/stream';
    const reader = body.getReader();
    const token = await this.receiveToken();
    const base = this.cacheService.getAppBaseUrl(this.appType!);
    const urlPbx = new URL(base);

    const options: https.RequestOptions = {
      hostname: urlPbx.hostname,
      port: urlPbx.port,
      path: url,
      protocol: urlPbx.protocol,
      method: 'POST',
      timeout: undefined,
      agent:
        urlPbx.protocol === 'https:'
          ? new https.Agent({ keepAlive: true })
          : new http.Agent({ keepAlive: true }),
      headers: {
        'Content-Type': 'application/octet-stream',
        'Transfer-Encoding': 'chunked',
        Authorization: token,
      },
      signal,
    };
    let request: http.ClientRequest | null = null;

    if (urlPbx.protocol === 'http:') {
      request = http.request(options);
    } else if (urlPbx.protocol === 'https:') {
      request = https.request(options);
    }

    cancelationToken.on('cancel', () => {
      controller.abort();
    });

    request!.on('error', () => {
      reader.cancel();
    });

    request!.on('finish', () => {
      reader.cancel();
    });

    for await (const chunk of readChunks(reader)) {
      request!.write(chunk);
    }
    return request;
  }
  /**
   * API get audio stream
   * @param source
   * @param participantId
   * @returns
   */
  public getAudioStream(source: string, participantId: number) {
    return this.fetch!.get(
      '/callcontrol' + `/${source}` + '/participants' + `/${participantId}` + '/stream',
      {
        responseType: 'stream',
      },
    );
  }
  /**
   *
   * @param source API makes call from DN without device specifying
   * @param dest
   * @returns
   */
  public makeCall(source: string, dest: string) {
    const url = '/callcontrol' + `/${source}` + '/makecall';
    return this.fetch!.post(
      url,
      {
        destination: dest,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }
  /**
   * API Makes call from device
   * @param source
   * @param deviceId
   * @param dest
   * @returns
   */
  public makeCallFromDevice(source: string, deviceId: string, dest: string) {
    const url = '/callcontrol' + `/${source}` + '/devices' + `/${deviceId}` + '/makecall';

    return this.fetch!.post(
      url,
      {
        destination: dest,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }
  /**
   * API Control Participant
   * @param source
   * @param participantId
   * @param method
   * @param destination
   * @returns
   */
  public controlParticipant(
    source: string,
    participantId: number,
    method: string,
    destination?: string,
  ) {
    const url =
      '/callcontrol' + `/${source}` + '/participants' + `/${participantId}` + `/${method}`;

    const body = destination ? { destination } : {};
    return this.fetch!.post(url, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }

  /**
   * request for incremental update of full info entity
   * @param ws
   * @returns
   */
  public requestUpdatedEntityFromWebhookEvent(ws: WSEvent) {
    return this.fetch!.get(ws.event.entity);
  }
}
