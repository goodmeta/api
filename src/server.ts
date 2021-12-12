import { once } from 'events'
import express from 'express'
import * as http from 'http'
import pEvent from 'p-event'
import { ApplicationConfig, VelvetApplication } from './application'

export { ApplicationConfig }

export class ExpressServer {
  public readonly app: express.Application
  public readonly lbApp: VelvetApplication
  private server?: http.Server

  constructor(options: ApplicationConfig = {}) {
    this.app = express()
    this.lbApp = new VelvetApplication(options)

    this.app.use('/api/v1', this.lbApp.requestHandler)
  }

  async boot() {
    await this.lbApp.boot()
  }

  public async start() {
    await this.lbApp.start()
    const port = this.lbApp.restServer.config.port ?? 3000
    const host = this.lbApp.restServer.config.host ?? '127.0.0.1'
    this.server = this.app.listen(port, host)
    await once(this.server, 'listening')
  }

  // For testing purposes
  public async stop() {
    if (!this.server) return
    await this.lbApp.stop()
    this.server.close()
    await pEvent(this.server, 'close')
    this.server = undefined
  }
}
