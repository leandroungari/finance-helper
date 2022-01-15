import Application from './core/Application'


import OrdersRouter from './routers/OrdersRouter'
import WalletsRouter from './routers/WalletsRouter'

const app = new Application()
app
  .register(OrdersRouter)
  .register(WalletsRouter)
  .start()


