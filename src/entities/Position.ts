export default class Position {
  private totalCost: number
  private currentPrice?: number

  constructor(
    private ticker: string,
    private quantity: number,
    private averageCost: number,
  ) {
    this.totalCost = this.quantity * this.averageCost
  }

  public getTicker() {
    return this.ticker
  }

  public getQuantity() {
    return this.quantity
  }
  
  public getAverageCost() {
    return this.averageCost
  }

  public getTotalCost() {
    return this.totalCost
  }

  public getCurrentPrice() {
    return this.currentPrice
  }

  public setCurrentPrice(value: number | undefined) {
    this.currentPrice = value
  }
}