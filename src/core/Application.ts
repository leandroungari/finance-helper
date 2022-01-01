import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Router from './Router'

export default class Application {
  private app: express.Application

  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    dotenv.config()
  }

  register(router: Router) {
    this.app.use(router.getName(), router.getInstance())
    return this;
  }

  registerAll(routers: Router[]) {
    routers.forEach((router) => this.register(router))
  }

  start() {
    this.app.listen(8000, () => {
      console.log('the server is running')
    })
  }
}