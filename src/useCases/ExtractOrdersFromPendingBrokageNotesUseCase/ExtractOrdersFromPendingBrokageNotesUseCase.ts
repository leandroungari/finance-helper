import Order from '../../entities/Order'
import Wallet from '../../entities/Wallet'
import BrokageNotesFileRepository from '../../externals/repositories/BrokageNotesFileRepository'
import BrokageNotesRepository from '../../externals/repositories/BrokageNotesRepository'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import ExtractOrdersUseCase from '../ExtractOrdersUseCase/ExtractOrdersUseCase'


export default class ExtractOrdersFromPendingBrokageNotesUseCase {

  private extractOrdersUseCase: ExtractOrdersUseCase

  constructor(
    private brokageNotesFileRepository: BrokageNotesFileRepository,
    private ordersRepository: OrdersRepository,
    private positionsRepository: PositionsRepository,
    private brokageNotesRepository: BrokageNotesRepository
  ) {
    this.extractOrdersUseCase = new ExtractOrdersUseCase(
      this.brokageNotesFileRepository,
      this.ordersRepository,
      this.positionsRepository
    )
  }

  public async execute(walletId: string) {
    const dates = await this.brokageNotesRepository.getNotProcessedNotes(walletId)
    const result: Date[] = []
    for(const date of dates) {
      await this.extractOrdersUseCase.execute(walletId, date.toISOString().split('T')[0])
      result.push(date)
    }
    await this.brokageNotesRepository.markNotesAsProcessed(walletId, result)
    return result.map((date) => date.toISOString().split('T')[0])
  }

}