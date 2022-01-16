import { OrderType } from './Order'
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


  public addNewInvestment(ticker: string, quantity: number, averagePrice: number, type: OrderType) {
    let isNewInvestiment: boolean = false
    let newPosition: Position
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    if (type === 'buy') {
      const index = this.positions.findIndex((item) => item.getTicker() === ticker)
      if (index !== -1) {
        const position = this.positions[index]
        const newTotalQuantity = position.getQuantity() + quantity
        const newAverageCost = (position.getTotalCost() + quantity * averagePrice) / newTotalQuantity
        isNewInvestiment = false
        newPosition = new Position(ticker, newTotalQuantity, newAverageCost)
        this.positions[index] = newPosition
      } else {
        isNewInvestiment = true
        newPosition = new Position(ticker, quantity, averagePrice)
        this.positions.push(newPosition)
      }
    } else {
      const index = this.positions.findIndex((item) => item.getTicker() === ticker)
      if (index !== -1) {
        const position = this.positions[index]
        newPosition = new Position(
          ticker, 
          position.getQuantity() - quantity,
          averagePrice
        )
        const soldValue = quantity * averagePrice
        newPosition.setTotalSold(position.getTotalSold() + soldValue)
        newPosition.setBalance(position.getBalance() + quantity * (averagePrice - position.getAverageCost()))
      } else {
        throw new Error('The asset was not found.')
      }
    }
    return {
      isNewInvestiment,
      position: newPosition
    }
  }
}