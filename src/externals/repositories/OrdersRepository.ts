import Order from '../../entities/Order'
import Wallet from '../../entities/Wallet'

export default interface OrdersRepository {

  save(wallet: Wallet, orders: Order[]): Promise<boolean>

  getOrdersByTicker(walletId: string, ticker: string): Promise<Order[]>

  replaceTickerFromOrders(walletId: string, from: string, to: string): Promise<boolean>
}