import Controller from '../../core/Controller'
import BrokageNoteRepository from '../../repositories/BrokageNoteRepository'
import BrokageNoteRepositoryFile from '../../repositories/BrokageNoteRepositoryFile'
import OrdersRepository from '../../repositories/OrdersRepository'
import OrdersRepositoryPostgres from '../../repositories/OrdersRepositoryPostgres'
import PositionsRepository from '../../repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../repositories/PositionsRepositoryPostgres'
import ExtractOrdersUseCase from './ExtractOrdersUseCase'

export default class ExtractOrdersController extends Controller {
  
  private brokageNoteRepository: BrokageNoteRepository
  private ordersRepository: OrdersRepository
  private positionsRepository: PositionsRepository

  constructor(
    private wallet: string, 
    private date: string
  ) {
    super()
    this.brokageNoteRepository = new BrokageNoteRepositoryFile()
    this.ordersRepository = new OrdersRepositoryPostgres()
    this.positionsRepository = new PositionsRepositoryPostgres()
  }

  async handle() {
    const useCase = new ExtractOrdersUseCase(this.brokageNoteRepository, this.ordersRepository, this.positionsRepository)
    const orders = await useCase.execute(this.wallet, this.date)
    return orders
  }

}