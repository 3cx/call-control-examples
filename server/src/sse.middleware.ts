import Koa from 'koa'
import { DialerAppService } from './services/DialerAppExample/DialerApp.service'
import { container } from 'tsyringe'
import { SSEStream } from './utils'

export default async function sseMiddleware(
    ctx: Koa.ParameterizedContext,
    next: Koa.Next
) {
    const dialerApp = container.resolve(DialerAppService)
    if (ctx.path !== '/sse') {
        return await next()
    }

    ctx.request.socket.setTimeout(0)
    ctx.req.socket.setNoDelay(true)
    ctx.req.socket.setKeepAlive(true)

    ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    })

    const stream = new SSEStream()
    ctx.status = 200
    ctx.body = stream

    dialerApp.sseEventEmitter.on('data', (data: unknown) => {
        stream.write(data)
    })
}
