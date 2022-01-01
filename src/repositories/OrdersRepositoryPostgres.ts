import { InternalServerError } from '../core/http'
import Order from '../entities/Order'
import Postgres from './connection/Postgres'
import OrdersRepository from './OrdersRepository'

export default class OrdersRepositoryPostgres
  extends Postgres
  implements OrdersRepository {

  constructor() {
    super()
  }

  async registerOrders(orders: Order[]): Promise<boolean> {
    try {
      const items = orders.map((element) => ({
        date: new Date(element.date),
        description: element.description,
        quantity: element.quantity,
        unitaryPrice: element.unitaryPrice,
        totalPrice: element.totalPrice,
        type: element.type === 'buy' ? 'B' : 'S'
      }))

      const { count } = await this.connection.order.createMany({ data: items })
      if (count === 0) {
        throw new InternalServerError('None register was inserted!')
      }
    } catch (error) {
      throw new InternalServerError(error)
    } finally {
      this.disconnect()
    }

    return true
  }

}