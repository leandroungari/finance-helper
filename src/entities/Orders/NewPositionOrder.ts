import { OrderType, OrderTypeCode } from './Order'
import CommonOrder from './CommonOrder'
import Position from '../Position'

export default class NewPositionOrder extends CommonOrder {

  public getType(): OrderType {
    return 'new-position'
  }
  
  public getTypeCode(): OrderTypeCode {
    return 'N'
  }
  
  public recalculate(position: Position | undefined): Position {
    if (position === undefined) {
      const newPosition = new Position(
        this.getDescription(),
        this.getQuantity(),
        this.getUnitaryPrice(),
        this.getCurrency(),
        this.getDate()
      )
      return newPosition
    }
    throw new Error('It\'s not possible to create a position from a spin-off whether it already exists!')
  }

}