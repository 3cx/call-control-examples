import 'reflect-metadata'
import { container, Lifecycle } from 'tsyringe'
import { AppService } from './App.service'
import { CacheService } from './Cache.service'
import { CustomIVRAppService } from './CustomIVRAppExample/CustomIVRApp.service'
import { ExternalApiService } from './ExternalApi.service'
import { OutboundCampaignService } from './OutboundCampaignExample/OutboundCampaignApp.service'
import { DialerAppService } from './DialerAppExample/DialerApp.service'

container.register(
    'AppService',
    { useClass: AppService },
    { lifecycle: Lifecycle.Singleton }
)
container.register(
    'CustomIVRService',
    { useClass: CustomIVRAppService },
    { lifecycle: Lifecycle.Singleton }
)
container.register(
    'OutboundCampaignService',
    { useClass: OutboundCampaignService },
    { lifecycle: Lifecycle.Singleton }
)
container.register(
    'DialerAppService',
    { useClass: DialerAppService },
    { lifecycle: Lifecycle.Singleton }
)
container.register(
    'CacheService',
    { useClass: CacheService },
    { lifecycle: Lifecycle.Singleton }
)
container.register(
    'ExternalApiService',
    { useClass: ExternalApiService },
    { lifecycle: Lifecycle.Transient }
)
