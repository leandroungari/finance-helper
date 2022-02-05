import { UploadedFile } from 'express-fileupload'
import { BadRequest } from '../core/http'
import Router from '../core/Router'
import CreateSnapshotController from '../useCases/CreateSnapshotUseCase/CreateSnapshotController'
import CreateWalletController from '../useCases/CreateWalletUseCase/CreateWalletController'
import ExtractOrdersFromPendingBrokageNotesController from '../useCases/ExtractOrdersFromPendingBrokageNotesUseCase/ExtractOrdersFromPendingBrokageNotesController'
import ExtractOrdersController from '../useCases/ExtractOrdersUseCase/ExtractOrdersController'
import GetAvailableSnapshotsController from '../useCases/GetAvailableSnapshotsUseCase/GetAvailableSnapshotsController'
import GetEarningsFromExtractController from '../useCases/GetEarningsFromExtractUseCase/GetEarningFromExtractController'
import GetOrdersOfAssetController from '../useCases/GetOrdersOfAssetUseCase/GetOrdersOfAssetController'
import GetPositionsOfWalletController from '../useCases/GetPositionsOfWalletUseCase/GetPositionsOfWalletController'
import GetSnapshotController from '../useCases/GetSnapshotUseCase/GetSnapshotController'
import MergePositionsController from '../useCases/MergePositionsUseCase/MergePositionsController'
import UpdateQuotesController from '../useCases/UpdateQuotesUseCase/UpdateQuotesController'
import UploadBrokageNotesController from '../useCases/UploadBrokageNotesUseCase/UploadBrokageNotesController'

const router = new Router('/wallets')

router.post('/', async (req, res) => {
  const data = req.body
  const controller = new CreateWalletController()
  return await controller.handle(data)
})


router.post('/:walletId/orders', async (req, res) => {
  const { walletId } = req.params
  const { date } = req.body
  const controller = new ExtractOrdersController()
  return await controller.handle(walletId, date)
})


router.get('/:walletId/orders/:ticker', async (req, res) => {
  const { walletId, ticker } = req.params
  const { from, to } = req.query
  let fromDate: Date | undefined = undefined
  let toDate: Date | undefined = undefined
  if (from) fromDate = new Date(from.toString())
  if (to) toDate = new Date(to.toString())
  const controller = new GetOrdersOfAssetController()
  return await controller.handle(walletId, ticker, fromDate, toDate)
})


router.get('/:walletId/positions', async (req, res) => {
  const { walletId } = req.params
  const notOnlyActive = Boolean(req.query.notOnlyActive)
  const controller = new GetPositionsOfWalletController()
  return await controller.handle(walletId, notOnlyActive)
})

router.patch('/:walletId/positions/merge', async (req, res) => {
  const { walletId } = req.params
  const { from, to } = req.body
  const controller = new MergePositionsController()
  return await controller.handle(walletId, from, to)
})

router.patch('/:walletId/positions/price', async (req, res) => {
  const { walletId } = req.params
  const controller = new UpdateQuotesController()
  return await controller.handle(walletId)
})

router.post('/:walletId/brokage-notes', async (req, res) => {
  const { walletId } = req.params
  const controller = new ExtractOrdersFromPendingBrokageNotesController()
  return await controller.handle(walletId)
})

router.post('/:walletId/snapshots', async (req, res) => {
  const { walletId } = req.params
  const { date } = req.body
  const controller = new CreateSnapshotController()
  return await controller.handle(walletId, date)
})

router.get('/:walletId/snapshots', async (req, res) => {
  const { walletId } = req.params
  const controller = new GetAvailableSnapshotsController()
  return await controller.handle(walletId)
})

router.get('/:walletId/snapshots/:date', async (req, res) => {
  const { walletId, date } = req.params
  const controller = new GetSnapshotController()
  return await controller.handle(walletId, new Date(date))
})


router.post('/:walletId/brokage-notes/upload', async (req, res) => {
  const files = req.files?.notes
  const { walletId } = req.params
  if (files !== undefined) {
    let items: UploadedFile[] = []
    if (Array.isArray(files)) {
      items = files
    } else {
      items.push(files)
    }
    const controller = new UploadBrokageNotesController()
    return await controller.handle(walletId, items)
  } else {
    throw new BadRequest(`The request expects at least a brokage note.`)
  }
})

router.post('/:walletId/extract/upload', async (req, res) => {
  const file = req.files?.extract
  const { walletId } = req.params
  if (file !== undefined && !Array.isArray(file)) {
    const controller = new GetEarningsFromExtractController()
    return await controller.handle(walletId, file)
  } else {
    throw new BadRequest(`The request expects at least a extract file (and only one).`)
  }
})



export default router