import { OrderType, OrderTypeCode } from './Order'
import Position from '../Position'
import CommonOrder from './CommonOrder'

export default class PurchaseOrder extends CommonOrder {

  public recalculate(position: Position | undefined): Position {
    if (position === undefined) {
      return new Position(
        this.getDescription(),
        this.getQuantity(),
        this.getUnitaryPrice(),
        this.getCurrency(),
        this.getDate()
      )
    } else {
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
      return newPosition
    }
  }

  public getType(): OrderType {
    return 'buy'
  }

  public getTypeCode(): OrderTypeCode {
    return 'B'
  }


}