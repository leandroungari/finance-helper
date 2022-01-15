import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import Router from './Router'

export default class Application {
  private app: express.Application

  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(fileUpload({
      createParentPath: true
    }))
    dotenv.config()
  }

  register(router: Router) {
    this.app.use(router.getName(), router.getInstance())
    return this
  }

  registerAll(routers: Router[]) {
    routers.forEach((router) => this.register(router))
  }

  start() {
    this.app.listen(process.env.PORT, () => {
      console.log('the server is running')
    })
  }
}