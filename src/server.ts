import express, { Request } from 'express'
import cors from 'cors'
import ExtractOrdersController from './useCases/ExtractOrdersUseCase/ExtractOrdersController'


const app = express()
app.use(cors())

app.get('/', (request: Request, response) => {
  const controller = new ExtractOrdersController(request, response)
  controller.handle()
})


app.listen(8000, () => {
  console.log('the server has started at port 8000')
})