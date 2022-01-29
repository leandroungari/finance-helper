import Order from '../../entities/Order'
import Wallet from '../../entities/Wallet'
import Postgres from './connection/Postgres'
import OrdersRepository from './OrdersRepository'

export default class OrdersRepositoryPostgres
  extends Postgres
  implements OrdersRepository {
  
  async getOrdersInInterval(walletId: string, from: Date, to: Date): Promise<Order[]> {
    const orders: Order[] = []
    try {
      const items = await this.connection.order.findMany({
        where: {
          wallet: walletId,
          date: {
            gt: from,
            lte: to
          }
        }
      })
      items.forEach((item) => {
        const order = new Order(
          item.description, 
          item.unitaryPrice, 
          item.quantity, 
          item.totalPrice, 
          item.currency,
          item.type === 'B' ? 'buy' : 'sell', 
          item.date.toISOString().split('T')[0]
        )
        orders.push(order)
      })
    } catch(error) {
      throw new Error(`Fail to retrieve the orders: ${error}`)
    }
    return orders
  }

  async getOrdersByTicker(walletId: string, ticker: string): Promise<Order[]> {
    let result: Order[] = []
    try {
      const items = await this.connection.order.findMany({
        where: {
          description: ticker
        },
        orderBy: {
          date: 'asc'
        }
      })
      result = items.map((item) => new Order(
        item.description, 
        item.unitaryPrice, 
        item.quantity, 
        item.totalPrice,
        item.currency,
        item.type === 'B' ? 'buy' : 'sell', 
        item.date.toISOString().split('T')[0]
      ))
    } catch(error) {
      throw new Error(`Cannot retrieve the orders of asset ${walletId}/${ticker}: ${error}`)
    } finally {
      this.disconnect()
    }
    return result
  }

  async replaceTickerFromOrders(walletId: string, from: string, to: string): Promise<boolean> {
    try {
      await this.connection.order.updateMany({
        where: {
          description: from,
          wallet: walletId
        },
        data: {
          description: to
        }
      })
    } catch(error) {
      throw new Error(`Cannot update the ticker of orders from ${from} to ${to}: ${error}`)
    } finally {
      this.disconnect()
    }
    return true
  }

  async save(wallet: Wallet, orders: Order[]): Promise<boolean> {
    const items = orders.map((element) => ({
      date: new Date(element.getDate()),
      description: element.getDescription(),
      quantity: element.getQuantity(),
      unitaryPrice: element.getUnitaryPrice(),
      totalPrice: element.getTotalPrice(),
      type: element.getType() === 'buy' ? 'B' : 'S',
      wallet: wallet.getId()
    }))
    try {
      const { count } = await this.connection.order.createMany({ data: items })
      if (count === 0) {
        throw new Error('None register was inserted!')
      }
    } catch (error) {
      throw new Error(`Fail to insert the orders: ${error} - ${JSON.stringify(items)}`)
    } finally {
      this.disconnect()
    }
    return true
  }

}