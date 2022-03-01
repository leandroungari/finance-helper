import BonusOrder from '../../entities/Orders/BonusOrder'
import CommonOrderMapper, { OrderEntity } from './CommonOrderMapper'

export default class BonusOrderMapper
  extends CommonOrderMapper<BonusOrder> {
  
  from(data: OrderEntity): BonusOrder {
    return new BonusOrder(
      data.description,
      data.date,
      data.quantity!,
      data.unitaryPrice!,
      data.currency!
    )
  }    
}