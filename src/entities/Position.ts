export default class Position {
  private totalCost: number
  private currentPrice?: number
  private lastInvestment?: Date
  private totalSold: number = 0
  private balance: number = 0

  constructor(
    private ticker: string,
    private quantity: number,
    private averageCost: number,
    private currency: string,
    private firstInvestment: Date
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

  public getBalance() {
    return this.balance
  }

  public setBalance(balance: number) {
    this.balance = balance
  }

  public getTotalSold() {
    return this.totalSold
  }

  public setTotalSold(value: number) {
    this.totalSold = value
  }


  public getFirstInvestment() {
    return this.firstInvestment
  }
  
  public getLastInvestment() {
    return this.lastInvestment
  }

  public setLastInvestment(value: Date) {
    this.lastInvestment = value
  }

  public getCurrency() {
    return this.currency
  }
}