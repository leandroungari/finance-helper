import Controller from '../../core/Controller'
import BrokageNoteRepository from '../../repositories/BrokageNoteRepository'
import BrokageNoteRepositoryFile from '../../repositories/BrokageNoteRepositoryFile'
import OrdersRepository from '../../repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../repositories/OrdersRepositoryPostgres'
import { BrokageNote } from './ExtractOrdersDTO'
import ExtractOrdersUseCase from './ExtractOrdersUseCase'

export default class ExtractOrdersController extends Controller<BrokageNote> {
  
  private brokageNoteRepository: BrokageNoteRepository
  private ordersRepository: OrdersRepository

  constructor() {
    super()
    this.brokageNoteRepository = new BrokageNoteRepositoryFile()
    this.ordersRepository = new OrdersRepositoryPostgres()
  }

  async handle(data: BrokageNote) {
    const useCase = new ExtractOrdersUseCase(this.brokageNoteRepository, this.ordersRepository)
    const orders = await useCase.execute(data)
    return orders
  }

}