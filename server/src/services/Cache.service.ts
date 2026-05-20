import * as NodeCache from 'node-cache'
import { injectable, singleton } from 'tsyringe'
import { ConnectAppRequest } from '../types'
import { AppType } from '../constants'
import { BadRequest } from '../Error'

/**
 * Responsible for storing data in cache, like access_token
 */
@injectable()
@singleton()
export class CacheService {
    public cache = new NodeCache()
    private TTL_ACCESS_TOKEN = 1800

    /**
     * Clear cache for particular application
     * @param appType
     */
    clearCache(appType: AppType) {
        const app = this.cache.get<ConnectAppRequest>(appType)
        if (app?.appId) {
            this.cache.del(app.appId + '_token') // remove token
        }
        this.cache.del(appType) // remove credentials
    }
    /**
     * set credentials for particular application
     * @param config
     * @param key
     */
    setAppCredentials(config: ConnectAppRequest, key: AppType) {
        this.cache.set(key, config)
    }
    /**
     * get base pbx url for particular application
     * @param appType
     * @returns
     */
    getAppBaseUrl(appType: AppType) {
        const appSett = this.cache.get<ConnectAppRequest>(appType)
        if (!appSett?.pbxBase) {
            throw new BadRequest(
                `BASE URL OF ${appType.toString()} is not defined`
            )
        }
        return appSett.pbxBase
    }
    /**
     * get PBX access_token for particular application
     * @param appType
     * @returns
     */
    getAppAccessToken(appType: AppType) {
        const app = this.cache.get<ConnectAppRequest>(appType)
        if (app?.appId) {
            const token = this.cache.get<string>(app.appId + '_token')
            return token
        }
    }
    /**
     * Set PBX access_token for particular application
     * @param appType
     * @param token
     */
    setAppAccessToken(appType: AppType, token: string) {
        const app = this.cache.get<ConnectAppRequest>(appType)

        if (app?.appId) {
            this.cache.set(
                app.appId + '_token',
                'Bearer ' + token,
                this.TTL_ACCESS_TOKEN
            )
        }
    }
    /**
     * get APPID of particuar application
     * @param appType
     * @returns
     */
    getAppId(appType: AppType) {
        const appSett = this.cache.get<ConnectAppRequest>(appType)
        if (!appSett?.appId) {
            throw new BadRequest(
                `APP_ID OF ${appType.toString()} is not defined`
            )
        }
        return appSett.appId
    }
    /**
     * get APPSECRET for particular application
     * @param appType
     * @returns
     */
    getAppSecret(appType: AppType) {
        const appSett = this.cache.get<ConnectAppRequest>(appType)
        if (!appSett?.appSecret) {
            throw new BadRequest(
                `APP_SECRET OF ${appType.toString()} is not defined`
            )
        }
        return appSett.appSecret
    }
}
