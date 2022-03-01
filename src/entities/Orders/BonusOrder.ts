import { OrderType, OrderTypeCode } from './Order'
import CommonOrder from './CommonOrder'
import Position from '../Position'

export default class BonusOrder extends CommonOrder {

  public recalculate(position: Position | undefined): Position {
    if (position === undefined) throw new Error('A bonus cannot be added to a not existing position')
    const newTotalQuantity = position.getQuantity() + this.getQuantity()
    const newAverageCost = (position.getTotalCost() + this.getQuantity() * this.getUnitaryPrice()) / newTotalQuantity
    const newPosition = new Position(
      position.getTicker(),
      newTotalQuantity,
      newAverageCost,
      position.getCurrency(),
      position.getFirstInvestment()
    )
    newPosition.setBalance(position.getBalance())
    newPosition.setTotalSold(position.getTotalSold())
    const bonusAmount = this.getQuantity() * this.getUnitaryPrice()
    newPosition.setBalance(position.getBalance() + bonusAmount)
    return newPosition
  }

  public getType(): OrderType {
    return 'bonus'
  }

  public getTypeCode(): OrderTypeCode {
    return 'O'
  }

}