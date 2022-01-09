import Order from '../entities/Order'
import Wallet from '../entities/Wallet'

export default interface OrdersRepository {

  save(wallet: Wallet, orders: Order[]): Promise<boolean>
}