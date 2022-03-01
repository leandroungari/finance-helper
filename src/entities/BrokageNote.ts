import Order from './Orders/Order'
import Wallet from './Wallet'

export default class BrokageNote {

  private orders?: Order[]

  constructor(
    private wallet: Wallet, 
    private date: string
  ) {
    if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(this.date)) 
      throw new Error('Invalid date.')
  }


  public setOrders(orders: Order[] | undefined) {
    this.orders = orders
  }


  public getOrders() {
    return this.orders
  }


  public getWallet() {
    return this.wallet
  }


  public getDate() {
    return this.date
  }
}