import Application from './core/Application'


import OrdersRouter from './routers/OrdersRouter'

const app = new Application()
app
  .register(OrdersRouter)
  .start()
/*
app.post('/', () => {
  const controller = new ExtractOrdersController()
  controller.handle()
})


app.listen(8000, () => {
  console.log('the server has started at port 8000')
})*/

