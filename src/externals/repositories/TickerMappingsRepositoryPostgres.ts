import Postgres from './connection/Postgres'
import TickerMappingsRepository, { Mappings } from './TickerMappingsRepository'

export default class TickerMappingsRepositoryPostgres
  extends Postgres
  implements TickerMappingsRepository {

  async createMapping(description: string, ticker: string): Promise<boolean> {
    try {
      const result = await this.connection.tickerMappings.count({
        where: {
          description
        }
      })
      if (result === 0) {
        await this.connection.tickerMappings.create({
          data: { description, ticker }
        })
      }
    } catch(error) {
      throw new Error(`It was not possible to create the mapping ${description} - ${ticker}: ${error}`)
    } finally {
      this.disconnect()
    }
    return true
  }

  async getMappedTicker(description: string): Promise<string> {
    let result: string = description
    try {
      const item = await this.connection.tickerMappings.findFirst({
        where: {
          description
        }
      })
      if (item) {
        result = item.ticker
      }
    } catch(error) {
      throw new Error(`Unable to retrieve the existing mappings: ${error}`)
    } finally {

    }
    return result
  }

  
}