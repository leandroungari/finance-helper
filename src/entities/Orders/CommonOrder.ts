import Order from './Order'

export default abstract class CommonOrder extends Order {

  private quantity: number
  private unitaryPrice: number
  private currency: string

  constructor(
    description: string,
    date: Date,
    quantity: number,
    unitaryPrice: number,
    currency: string
  ) {
    super(description, date)
    this.quantity = quantity
    this.unitaryPrice = unitaryPrice
    this.currency = currency
  }

  public getUnitaryPrice() {
    return this.unitaryPrice
  }

  public getQuantity() {
    return this.quantity
  }

  public getTotalPrice() {
    return this.quantity * this.unitaryPrice
  }

  public getCurrency() {
    return this.currency
  }
}