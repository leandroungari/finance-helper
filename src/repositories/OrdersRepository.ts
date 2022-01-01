import Order from '../entities/Order'

export default interface OrdersRepository {

  registerOrders(orders: Order[], wallet: string): Promise<boolean>
}