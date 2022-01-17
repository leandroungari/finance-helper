import Order from '../../entities/Order'
import Wallet from '../../entities/Wallet'
import Postgres from './connection/Postgres'
import OrdersRepository from './OrdersRepository'

export default class OrdersRepositoryPostgres
  extends Postgres
  implements OrdersRepository {

  constructor() {
    super()
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