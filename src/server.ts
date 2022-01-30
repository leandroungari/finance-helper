import Application from './core/Application'


import WalletsRouter from './routers/WalletsRouter'

const app = new Application()
app
  .register(WalletsRouter)
  .start()


