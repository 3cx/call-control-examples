import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { CacheService } from "./Cache.service";
import { ConnectAppRequest, WebhookEvent } from "../types";
import { inject, injectable } from "tsyringe";
import * as https from "https";
import * as http from "http";
import { readChunks } from "../utils";
import { AppType } from "../constants";

@injectable()
export class ExternalApiService {
  private fetch: AxiosInstance | null = null;
  public appType: AppType | null = null;
  controller: AbortController | null = null;

  constructor(@inject(CacheService) private cacheService: CacheService) {}
  /**
   * Setup service for particular application
   * Each application has its own API service, credentials, token ,etc
   * So this service has per-instance lifecycle
   * @param connetConfig
   * @param appType
   */
  public setup(connetConfig: ConnectAppRequest, appType: AppType) {
    this.appType = appType;

    this.cacheService.setAppCredentials(connetConfig, appType);

    this.fetch = axios.create({
      baseURL: this.cacheService.getAppBaseUrl(appType), // TODO
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

  disconnect() {
    if (this.appType !== null) {
      this.cacheService.clearCache(this.appType);
    }
  }
  /**
   * API connect for recieve or refresh (if cash or token expired) access_token
   * @returns
   */
  private async receiveToken() {
    if (this.appType === null) {
      throw Error("App not configured");
    }
    const token = this.cacheService.getAppAccessToken(this.appType);
    if (!token) {
      const appId = this.cacheService.getAppId(this.appType);
      const appSecret = this.cacheService.getAppSecret(this.appType);
      if (!appId || !appSecret) {
        throw new Error("Application ID or Secret are not defined");
      }
      try {
        const uninterceptedAxiosInstance = axios.create({
          baseURL: this.cacheService.getAppBaseUrl(this.appType),
        });
        const formParams: { append(param: string, value?: string): any } =
          new FormData();
        formParams.append("client_id", appId);
        formParams.append("client_secret", appSecret);
        formParams.append("grant_type", "client_credentials");

        const resp = await uninterceptedAxiosInstance.post(
          "/connect/token",
          formParams,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.cacheService.setAppAccessToken(
          this.appType,
          resp.data.access_token
        );
        return this.cacheService.getAppAccessToken(this.appType)!;
      } catch (err) {
        console.log(err);
        throw new Error("Unable to receive access token");
      }
    }
    return token;
  }
  /**
   * Abort request with node Abort Controller. It's needed for streams shutdown
   */
  public abortRequest() {
    this.controller?.abort();
    console.log("REQUEST ABORTED");
  }

  public getFullInfo() {
    return this.fetch!.get("/callcontrol");
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
    body: ReadableStream<any>
  ) {
    this.controller = new AbortController();
    const signal = this.controller.signal;
    const url =
      "/callcontrol" +
      `/${source}` +
      "/participants" +
      `/${participantId}` +
      "/stream";
    const reader = body.getReader();
    const token = await this.receiveToken();
    const base = this.cacheService.getAppBaseUrl(this.appType!);
    const urlPbx = new URL(base);

    const options: https.RequestOptions = {
      hostname: urlPbx.hostname,
      port: urlPbx.port,
      path: url,
      protocol: urlPbx.protocol,
      method: "POST",
      timeout: undefined,
      agent:
        urlPbx.protocol === "https:"
          ? new https.Agent({ keepAlive: true })
          : new http.Agent({ keepAlive: true }),
      headers: {
        "Content-Type": "application/octet-stream",
        "Transfer-Encoding": "chunked",
        Authorization: token,
      },
      signal,
    };
    let request: http.ClientRequest | null = null;
    if (urlPbx.protocol === "http:") {
      request = http.request(options, (res) => {});
    } else if (urlPbx.protocol === "https:") {
      request = https.request(options, (res) => {});
    }

    request!.on("error", (err) => {
      reader.cancel().then(() => {
        console.log("READABLE STREAM CLOSED");
      });
    });
    request!.on("timeout", () => console.log("REQ TIMEOUT"));
    request!.on("close", () => console.log("REQ CLOSE"));

    request!.on("finish", () => {
      reader.cancel().then(() => {
        console.log("READABLE STREAM FINISHED");
      });
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
      "/callcontrol" +
        `/${source}` +
        "/participants" +
        `/${participantId}` +
        "/stream",
      {
        responseType: "stream",
      }
    );
  }
  /**
   *
   * @param source API makes call from DN without device specifying
   * @param dest
   * @returns
   */
  public makeCall(source: string, dest: string) {
    const url = "/callcontrol" + `/${source}` + "/makecall";
    return this.fetch!.post(
      url,
      {
        destination: dest,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
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
    const url =
      "/callcontrol" + `/${source}` + "/devices" + `/${deviceId}` + "/makecall";

    return this.fetch!.post(
      url,
      {
        destination: dest,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
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
    destination?: string
  ) {
    const url =
      "/callcontrol" +
      `/${source}` +
      "/participants" +
      `/${participantId}` +
      `/${method}`;

    const body = destination ? { destination } : {};
    return this.fetch!.post(url, body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  /**
   * request for incremental update of full info entity
   * @param webhook
   * @returns
   */
  public requestUpdatedEntityFromWebhookEvent(webhook: WebhookEvent) {
    return this.fetch!.get(webhook.event.entity);
  }
}
