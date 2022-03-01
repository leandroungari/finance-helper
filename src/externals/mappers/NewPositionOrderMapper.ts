import NewPositionOrder from '../../entities/Orders/NewPositionOrder'
import CommonOrderMapper, { OrderEntity } from './CommonOrderMapper'

export default class NewPositionOrderMapper
  extends CommonOrderMapper<NewPositionOrder> {
  
  from(data: OrderEntity): NewPositionOrder {
    return new NewPositionOrder(
      data.description,
      data.date,
      data.quantity!,
      data.unitaryPrice!,
      data.currency!
    )
  }
  
}