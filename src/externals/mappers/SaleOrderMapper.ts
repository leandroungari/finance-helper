import SaleOrder from '../../entities/Orders/SaleOrder'
import CommonOrderMapper, { OrderEntity } from './CommonOrderMapper'

export default class SaleOrderMapper 
  extends CommonOrderMapper<SaleOrder> {
  
  from(data: OrderEntity): SaleOrder {
    return new SaleOrder(
      data.description,
      data.date,
      data.quantity!,
      data.unitaryPrice!,
      data.currency!
    )
  }

}