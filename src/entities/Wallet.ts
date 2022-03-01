import Order from './Orders/Order'
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

  public validate(): boolean {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    const descriptionsOfPositions = this.positions.map((item) => item.getTicker())
    const positionWithBlankSpace = descriptionsOfPositions.filter((item) => item.includes(' '))
    if (positionWithBlankSpace.length > 0) {
      throw new Error(`There are positions that need some adjustment: ${positionWithBlankSpace}`)
    }
    return true
  }

  public getPositions() {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
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

  getPositionFromTicker(ticker: string) {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    return this.positions
      .find((item) => item.getTicker() === ticker && item.getLastInvestment() === undefined)
  }

  getPositionByIndex(index: number) {
    if (this.positions === undefined) throw new Error('The positions were not loaded.')
    return this.positions[index]
  }

  addOrReplacePosition(position: Position) {
    const index = this.getPositions()
      .findIndex((item) => item.getTicker() === position.getTicker() && item.getLastInvestment() === undefined)
    if(index !== -1 ) {
      this.positions![index] = position
    } else {
      this.addNewPosition(position)
    }
  }

  private addNewPosition(position: Position) {
    this.getPositions().push(position)
  }

  public addNewInvestment(order: Order) {
    let isNewInvestiment: boolean = false
    const position = this.getPositionFromTicker(order.getDescription())
    if (position === undefined) {
      isNewInvestiment = true
    }
    const newPosition = order.recalculate(position)
    this.addOrReplacePosition(newPosition)
    return {
      isNewInvestiment,
      position: newPosition
    }
  }

  public recalculatePosition(orders: Order[]) {
    let position: Position | undefined = undefined
    orders.forEach((order) => {
      position = order.recalculate(position)
    })
    return position!
  }

  contains(ticker: string) {
    if (this.positions === undefined) throw new Error('The positions are not loaded!')
    return this.positions.some((item) => item.getTicker() === ticker)
  }
}