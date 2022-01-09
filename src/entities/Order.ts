
export type OrderType = 'sell' | 'buy'

export default class Order {

  constructor(
    private description: string,
    private unitaryPrice: number,
    private quantity: number,
    private totalPrice: number,
    private type: OrderType,
    private date: string
  ) { }

  public getDescription() {
    return this.description
  }

  public getUnitaryPrice() {
    return this.unitaryPrice
  }

  public getQuantity() {
    return this.quantity
  }

  public getTotalPrice() {
    return this.totalPrice
  }

  public getType() {
    return this.type
  }

  public getDate() {
    return this.date
  }


}