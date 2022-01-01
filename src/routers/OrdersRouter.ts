import Router from '../core/Router'
import ExtractOrdersController from '../useCases/ExtractOrdersUseCase/ExtractOrdersController'

const router = new Router('/orders')

router.post('/', async (req, res) => {
  const controller = new ExtractOrdersController()
  return await controller.handle(req.body)
})



export default router