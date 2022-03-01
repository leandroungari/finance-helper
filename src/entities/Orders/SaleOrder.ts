import { OrderType, OrderTypeCode } from './Order'
import Position from '../Position'
import CommonOrder from './CommonOrder'

export default class SaleOrder extends CommonOrder {
  
  public recalculate(position: Position | undefined): Position {
    if (position === undefined) throw new Error('It\'s not possible to sell an unexisting position of wallet')
    const newPosition = new Position(
      position.getTicker(),
      position.getQuantity() - this.getQuantity(),
      position.getAverageCost(),
      position.getCurrency(),
      position.getFirstInvestment()
    )
    const soldValue = this.getQuantity() * this.getUnitaryPrice()
    newPosition.setTotalSold(position.getTotalSold() + soldValue)
    newPosition.setBalance(position.getBalance() + this.getQuantity() * (this.getUnitaryPrice() - position.getAverageCost()))
    if (newPosition.getQuantity() === 0) {
      newPosition.setLastInvestment(this.getDate())
    }
    return newPosition
  }
  
  public getType(): OrderType {
    return 'sell'
  }

  public getTypeCode(): OrderTypeCode {
    return 'S'
  }

}