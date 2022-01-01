import Order from '../entities/Order'

export default interface OrdersRepository {

  registerOrders(orders: Order[]): Promise<boolean>
}