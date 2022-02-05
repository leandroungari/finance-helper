import { EarningDTO } from '../../useCases/GetEarningsFromExtractUseCase/GetEarningFromExtractDTO'
import Postgres from './connection/Postgres'
import EarningsRepository from './EarningsRepository'

export default class EarningsRepositoryPostgres
  extends Postgres
  implements EarningsRepository {

  async saveEarnings(walletId: string, earnings: EarningDTO[]): Promise<boolean> {
    const items = earnings.map((item) => ({
      date: item.date,
      walletId: walletId,
      ticker: item.ticker,
      type: item.type,
      currency: item.currency,
      value: item.value
    }))
    await this.connection.earnings.createMany({
      data: items,
      skipDuplicates: true
    })
    return true
  }

}