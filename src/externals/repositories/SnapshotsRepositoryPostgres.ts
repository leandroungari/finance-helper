import Position from '../../entities/Position'
import Postgres from './connection/Postgres'
import SnapshotsRepository from './SnapshotsRepository'

export default class SnapshotsRepositoryPostgres
  extends Postgres
  implements SnapshotsRepository {
  
  async save(walletId: string, date: Date, positions: Position[]): Promise<boolean> {
    try {
      const items = positions.map((item) => ({
        walletId,
        date,
        description: item.getTicker(),
        quantity: item.getQuantity(),
        averageCost: item.getAverageCost(),
        currentPrice: item.getCurrentPrice() ?? 0,
        firstInvestment: item.getFirstInvestment(),
        lastInvestment: item.getLastInvestment(),
        balance: item.getBalance(),
        totalSold: item.getTotalSold()
      }))
      await this.connection.snapshots.createMany({
        data: items
      })
    } catch(error) {
      throw new Error(`Fail to create the snapshot: ${error}`)
    } finally {
      this.disconnect()
    }
    return true
  }
  
  async getPositions(walletId: string, date: Date): Promise<Position[]> {
    const result: Position[] = []
    try {
      const items = await this.connection.snapshots.findMany({
        where: {
          walletId: walletId,
          date: date
        }
      })
      items.forEach((item) => {
        const position = new Position(
          item.description, 
          item.quantity, 
          item.averageCost, 
          item.currency,
          item.firstInvestment
        )
        position.setCurrentPrice(item.currentPrice)
        position.setBalance(item.balance)
        if (item.lastInvestment) {
          position.setLastInvestment(item.lastInvestment)
        }
        position.setTotalSold(item.totalSold)
        result.push(position)
      })
    } catch(error) {
      throw new Error(`Fail to retrive the positions of snapshot ${date.toISOString().split('T')[0]}: ${error}`)
    } finally {
      this.disconnect()
    }
    return result
  }

  async getSnapshotsAvailable(walletId: string): Promise<Date[]> {
    const dates: Date[] = []
    try {
      const items = await this.connection.snapshots.findMany({
        where: {
          walletId
        },
        select: {
          date: true
        },
        orderBy: {
          date: 'asc'
        }
      })
      items.forEach((item) => {
        dates.push(item.date)
      })
    } catch(error) {
      throw new Error(`Fail to retrieve previous snapshots of this wallet ${walletId}: ${error}`)
    } finally {
      this.disconnect()
    }
    return dates
  }


}