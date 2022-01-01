import Controller from '../../core/Controller'
import BrokageNoteRepository from '../../repositories/BrokageNoteRepository'
import BrokageNoteRepositoryFile from '../../repositories/BrokageNoteRepositoryFile'
import { BrokageNote } from './ExtractOrdersDTO'
import ExtractOrdersUseCase from './ExtractOrdersUseCase'

export default class ExtractOrdersController extends Controller<BrokageNote> {
  
  private brokageNoteRepository: BrokageNoteRepository

  constructor() {
    super()
    this.brokageNoteRepository = new BrokageNoteRepositoryFile()
  }

  async handle(data: BrokageNote) {
    const useCase = new ExtractOrdersUseCase(this.brokageNoteRepository)
    const orders = await useCase.execute(data)
    return orders
  }

}