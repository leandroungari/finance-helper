import { Request } from 'express'
import Router from '../core/Router'
import ExtractOrdersController from '../useCases/ExtractOrdersUseCase/ExtractOrdersController'

const router = new Router('/orders')

type ExtractOrderDTO = {
  date: string,
  wallet: string,
}

router.post('/', async (req: Request<ExtractOrderDTO>, res) => {
  const controller = new ExtractOrdersController(req.body.wallet, req.body.date)
  return await controller.handle()
})


export default router