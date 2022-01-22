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
      this.positionsRepository,
      this.brokageNotesRepository
    )
  }

  public async execute(walletId: string) {
    const maxLimit = Number(process.env.MAX_NOTES_PER_EXECUTION ?? 5)
    const dates = await this.brokageNotesRepository.getNotProcessedNotes(walletId, maxLimit)
    const result: Date[] = []
    for(const date of dates) {
      await this.extractOrdersUseCase.execute(walletId, date.toISOString().split('T')[0])
      result.push(date)
    }
    return result.map((date) => date.toISOString().split('T')[0])
  }

}