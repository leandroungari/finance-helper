import Order, { OrderType } from './Order'
import Position from './Position'

export default class Wallet {
  private positions?: Position[]
  private owner?: string

  constructor(
    private id: string,
  ) { }


  public getId() {
    return this.id
  }


  public getOwner() {
    return this.owner
  }


  public setPositions(positions: Position[] | undefined) {
    this.positions = positions
  }


  public getPositions() {
    return this.positions
  }


  public setOwner(owner: string | undefined) {
    this.owner = owner
  }

  getIndexFromTicker(ticker: string) {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    return this.positions
      .findIndex((item) => item.getTicker() === ticker && item.getLastInvestment() == undefined)
  }

  getPositionByIndex(index: number) {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    return this.positions[index]
  }

  updatePositionByIndex(index: number, position: Position) {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    this.positions[index] = position
  }

  addNewPosition(position: Position) {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    this.positions.push(position)
  }


  public addNewInvestment(ticker: string, quantity: number, averagePrice: number, type: OrderType, date: Date) {
    let isNewInvestiment: boolean = false
    let newPosition: Position
    if (type === 'buy') {
      const index = this.getIndexFromTicker(ticker)
      if (index !== -1) {
        const position = this.getPositionByIndex(index)
        const newTotalQuantity = position.getQuantity() + quantity
        const newAverageCost = (position.getTotalCost() + quantity * averagePrice) / newTotalQuantity
        isNewInvestiment = false
        newPosition = new Position(
          ticker, 
          newTotalQuantity, 
          newAverageCost, 
          position.getFirstInvestment()
        )
        newPosition.setBalance(position.getBalance())
        newPosition.setTotalSold(position.getTotalSold())
        this.updatePositionByIndex(index, newPosition)
      } else {
        isNewInvestiment = true
        newPosition = new Position(ticker, quantity, averagePrice, date)
        this.addNewPosition(newPosition)
      }
    } else {
      const index = this.getIndexFromTicker(ticker)
      if (index !== -1) {
        const position = this.getPositionByIndex(index)
        newPosition = new Position(
          ticker,
          position.getQuantity() - quantity,
          position.getAverageCost(),
          position.getFirstInvestment()
        )
        const soldValue = quantity * averagePrice
        newPosition.setTotalSold(position.getTotalSold() + soldValue)
        newPosition.setBalance(position.getBalance() + quantity * (averagePrice - position.getAverageCost()))
        if (newPosition.getQuantity() === 0) {
          newPosition.setLastInvestment(date)
        }
        this.updatePositionByIndex(index, newPosition)
      } else {
        throw new Error(`The asset was not found: ${ticker}`)
      }
    }
    return {
      isNewInvestiment,
      position: newPosition
    }
  }

  public recalculatePosition(ticker: string, orders: Order[]) {
    let totalSold = 0
    let balance = 0
    let quantity = 0
    let averageCost = 0
    let firstInvestment: Date = new Date()
    let lastInvestment: Date | null = null

    orders.forEach((order, index) => {
      if (order.getType() === 'buy') {
        if (quantity === 0) {
          firstInvestment = new Date(order.getDate())
        }
        averageCost = (quantity * averageCost + order.getTotalPrice()) / (quantity + order.getQuantity())
        quantity += order.getQuantity()
      } else {
        quantity -= order.getQuantity()
        totalSold += order.getQuantity() * order.getUnitaryPrice()
        balance += order.getQuantity() * (averageCost - order.getUnitaryPrice())
        if (quantity === 0) {
          lastInvestment = new Date(order.getDate())
          if (index < orders.length - 1) throw new Error('Cannot recalculate the position of asset')
        }
      }
    })

    const position = new Position(ticker, quantity, averageCost, firstInvestment)
    position.setBalance(balance)
    position.setTotalSold(totalSold)
    if (lastInvestment !== null) {
      position.setLastInvestment(lastInvestment)
    }
    return position
  }

  contains(ticker: string) {
    if (this.positions === undefined) throw new Error('The positions are not loaded!')
    return this.positions.some((item) => item.getTicker() === ticker)
  }
}