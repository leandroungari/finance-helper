import Application from './core/Application'


import OrdersRouter from './routers/OrdersRouter'

const app = new Application()
app
  .register(OrdersRouter)
  .start()


