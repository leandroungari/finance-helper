import PurchaseOrder from '../../entities/Orders/PurchaseOrder'
import CommonOrderMapper, { OrderEntity } from './CommonOrderMapper'

export default class PurchaseOrderMapper
  extends CommonOrderMapper<PurchaseOrder> {

  from(data: OrderEntity): PurchaseOrder {
    return new PurchaseOrder(
      data.description,
      data.date,
      data.quantity!,
      data.unitaryPrice!,
      data.currency!
    )
  }

}