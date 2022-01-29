import Position from '../../entities/Position'
import Postgres from './connection/Postgres'
import PositionsRepository from './PositionsRepository'

export default class PositionsRepositoryPostgres
  extends Postgres
  implements PositionsRepository {

  constructor() {
    super()
  }

  async updateCurrentPrice(walletId: string, ticker: string, price: number): Promise<boolean> {
    try {
      await this.connection.position.updateMany({
        where: {
          walletId,
          description: ticker,
          lastInvestment: null
        },
        data: {
          currentPrice: price
        }
      })
    } catch(error) {
      throw new Error(`Cannot update the price of ${walletId}/${ticker}: ${error}`)
    } finally {
      this.disconnect()
    }
    return true
  }

  async delete(walletId: string, ticker: string, firstInvestment: Date): Promise<boolean> {
    try {
      await this.connection.position.delete({
        where: {
          walletId_description_firstInvestment: {
            walletId,
            description: ticker,
            firstInvestment
          }
        }
      })
    } catch(error) {
      throw new Error(`Fail to delete the position ${walletId}/${ticker}/`)
    } finally {
      this.disconnect()
    }
    return true
  }

  async getAllPositionsFromWallet(wallet: string): Promise<Position[]> {
    let result: Position[] = []
    try {
      const items = await this.connection.position.findMany({
        where: {
          walletId: wallet,
          lastInvestment: null,
        }
      })
      result = items.map((item) => {
        const position = new Position(
          item.description, 
          item.quantity, 
          item.averageCost,
          item.currency,
          item.firstInvestment
        )
        position.setCurrentPrice(item.currentPrice)
        position.setBalance(item.balance)
        position.setTotalSold(item.totalSold)
        return position
      })
    } catch(err) {
      throw err
    } finally {
      this.disconnect()
    }
    return result
  }

  async save(wallet: string, position: Position): Promise<boolean> {
    try {
      const newItem = {
        averageCost: position.getAverageCost(),
        quantity: position.getQuantity(),
        description: position.getTicker(),
        walletId: wallet,
        currentPrice: 0,
        firstInvestment: position.getFirstInvestment()
      }
      await this.connection.position.create({ data: newItem })
    } catch (err) {
      throw err
    } finally {
      this.disconnect()
    }
    return true
  }


  async update(wallet: string, position: Position): Promise<boolean> {
    try {
      await this.connection.position.update({
        where: {
          walletId_description_firstInvestment: {
            walletId: wallet,
            description: position.getTicker(),
            firstInvestment: position.getFirstInvestment()
          }
        },
        data: {
          averageCost: position.getAverageCost(),
          currentPrice: position.getCurrentPrice(),
          description: position.getTicker(),
          quantity: position.getQuantity(),
          walletId: wallet,
          balance: position.getBalance(),
          totalSold: position.getTotalSold(),
          firstInvestment: position.getFirstInvestment(),
          lastInvestment: position.getLastInvestment()
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
        const position = new Position(
          result.description, 
          result.quantity, 
          result.averageCost, 
          result.currency,
          result.firstInvestment
        )
        position.setCurrentPrice(result.currentPrice)
        return position
      }
      return undefined
    } catch (err) {
      throw err
    }
  }

}