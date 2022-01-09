import Order from '../entities/Order'
import Wallet from '../entities/Wallet'
import Postgres from './connection/Postgres'
import OrdersRepository from './OrdersRepository'

export default class OrdersRepositoryPostgres
  extends Postgres
  implements OrdersRepository {

  constructor() {
    super()
  }

  async save(wallet: Wallet, orders: Order[]): Promise<boolean> {
    try {
      const items = orders.map((element) => ({
        date: new Date(element.date),
        description: element.description,
        quantity: element.quantity,
        unitaryPrice: element.unitaryPrice,
        totalPrice: element.totalPrice,
        type: element.type === 'buy' ? 'B' : 'S',
        wallet: wallet.id
      }))

      const { count } = await this.connection.order.createMany({ data: items })
      if (count === 0) {
        throw new Error('None register was inserted!')
      }
    } catch (error) {
      throw error
    } finally {
      this.disconnect()
    }

    return true
  }

}