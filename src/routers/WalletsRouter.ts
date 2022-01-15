import { UploadedFile } from 'express-fileupload'
import { BadRequest } from '../core/http'
import Router from '../core/Router'
import ExtractOrdersFromPendingBrokageNotesController from '../useCases/ExtractOrdersFromPendingBrokageNotesUseCase/ExtractOrdersFromPendingBrokageNotesController'
import UploadBrokageNotesController from '../useCases/UploadBrokageNotesUseCase/UploadBrokageNotesController'

const router = new Router('/wallets')

router.post('/:walletId/brokage-notes', async (req, res) => {
  const { walletId } = req.params
  const controller = new ExtractOrdersFromPendingBrokageNotesController()
  return await controller.handle(walletId)
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


export default router