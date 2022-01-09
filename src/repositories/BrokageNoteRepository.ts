import Order from '../entities/Order'
import Wallet from '../entities/Wallet'

export default interface BrokageNoteRepository {

  extractOrders(wallet: Wallet, date: string): Promise<Order[]>
}