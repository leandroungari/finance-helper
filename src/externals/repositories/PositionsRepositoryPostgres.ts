import Position from '../../entities/Position'
import Postgres from './connection/Postgres'
import PositionsRepository from './PositionsRepository'

export default class PositionsRepositoryPostgres
  extends Postgres
  implements PositionsRepository {

  constructor() {
    super()
  }

  async getAllPositionsFromWallet(wallet: string): Promise<Position[]> {
    let result: Position[] = []
    try {
      const items = await this.connection.position.findMany({
        where: {
          walletId: wallet,
        }
      })
      result = items.map((item) => {
        const position = new Position(item.description, item.quantity, item.averageCost)
        position.setCurrentPrice(item.currentPrice)
        return position
      })
    } catch(err) {
      throw err
    } finally {
      this.disconnect()
    }
    return result
  }

  async save(wallet: string, position: Position, investmentDate: Date): Promise<boolean> {
    try {
      const newItem = {
        averageCost: position.getAverageCost(),
        quantity: position.getQuantity(),
        description: position.getTicker(),
        walletId: wallet,
        currentPrice: 0,
        firstInvestment: investmentDate
      }
      await this.connection.position.create({ data: newItem })
    } catch (err) {
      throw err
    } finally {
      this.disconnect()
    }
    return true
  }


  async update(wallet: string, position: Position, investmentDate: Date): Promise<boolean> {
    try {
      await this.connection.position.update({
        where: {
          walletId_description: {
            walletId: wallet,
            description: position.getTicker()
          }
        },
        data: {
          averageCost: position.getAverageCost(),
          currentPrice: position.getCurrentPrice(),
          description: position.getTicker(),
          quantity: position.getQuantity(),
          walletId: wallet,
          lastInvestment: position.getQuantity() === 0 ? investmentDate : undefined
        }
      })
    } catch (err) {
      throw err
    } finally {
      this.disconnect()
    }

    return true
  }


  async getPositionByTicker(wallet: string, ticker: string): Promise<Position | undefined> {
    try {
      const result = await this.connection.position.findFirst({
        where: {
          description: ticker,
          walletId: wallet
        }
      })
      if (result) {
        const position = new Position(result.description, result.quantity, result.averageCost)
        position.setCurrentPrice(result.currentPrice)
        return position
      }
      return undefined
    } catch (err) {
      throw err
    }
  }

}