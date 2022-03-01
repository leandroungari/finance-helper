import Order from '../../entities/Orders/Order'
import Wallet from '../../entities/Wallet'

export default interface OrdersRepository {

  save(wallet: Wallet, orders: Order[]): Promise<boolean>

  getOrdersByTicker(walletId: string, ticker: string): Promise<Order[]>

  replaceTickerFromOrders(walletId: string, from: string, to: string): Promise<boolean>

  getOrdersInInterval(walletId: string, from: Date, to: Date): Promise<Order[]>

  getOrdersByTickerInInterval(walletId: string, ticker: string, from?: Date, to?: Date): Promise<Order[]>
}