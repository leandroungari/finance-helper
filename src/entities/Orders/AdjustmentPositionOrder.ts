import Order, { OrderType, OrderTypeCode } from './Order'
import Position from '../Position'

export default class AdjustmentPositionOrder extends Order {
  
  private rate: number

  constructor(description: string, date: Date, rate: number) {
    super(description, date);
    this.rate = rate
  }

  public getRate() {
    return this.rate
  }

  public recalculate(position: Position | undefined): Position {
    if (position === undefined) throw new Error('It is not possible to adjust a not existing position!')
    const newPosition = new Position(
      position.getTicker(),
      position.getQuantity(),
      position.getAverageCost() * (1 - this.rate),
      position.getCurrency(),
      position.getFirstInvestment()
    )
    const outValue = position.getQuantity() * position.getAverageCost() * this.rate
    newPosition.setTotalSold(position.getTotalSold() + outValue)
    return newPosition
  }

  public getType(): OrderType {
    return 'adjustment-position'
  }

  public getTypeCode(): OrderTypeCode {
    return 'A'
  }

}