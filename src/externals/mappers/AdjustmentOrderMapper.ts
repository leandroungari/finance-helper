import AdjustmentPositionOrder from '../../entities/Orders/AdjustmentPositionOrder'
import { OrderEntity } from './CommonOrderMapper'
import OrderMapper from './OrderMapper'

export default class AdjustmentPositionOrderMapper
  extends OrderMapper<AdjustmentPositionOrder> {
  
  to(item: AdjustmentPositionOrder): OrderEntity {
    return {
      date: item.getDate(),
      description: item.getDescription(),
      type: item.getTypeCode(),
      rate: item.getRate()
    }
  }


  from(data: OrderEntity): AdjustmentPositionOrder {
    return new AdjustmentPositionOrder(
      data.description,
      data.date,
      data.rate!
    )
  }

}