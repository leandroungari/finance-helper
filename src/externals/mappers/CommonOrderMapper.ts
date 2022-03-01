import CommonOrder from '../../entities/Orders/CommonOrder'
import { OrderTypeCode } from '../../entities/Orders/Order'
import OrderMapper from './OrderMapper'

export type OrderEntity = {
  type: OrderTypeCode,
  description: string,
  quantity?: number,
  unitaryPrice?: number,
  totalPrice?: number,
  currency?: string,
  rate?: number,
  date: Date
}

export default abstract class CommonOrderMapper<T extends CommonOrder>
  extends OrderMapper<T> {

  to(item: T): OrderEntity {
    return {
      type: item.getTypeCode(),
      date: item.getDate(),
      description: item.getDescription(),
      currency: item.getCurrency(),
      quantity: item.getQuantity(),
      totalPrice: item.getTotalPrice(),
      unitaryPrice: item.getUnitaryPrice()
    }
  }

  abstract from(data: OrderEntity): T
}