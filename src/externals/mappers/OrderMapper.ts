import Order from '../../entities/Orders/Order'
import { OrderEntity } from './CommonOrderMapper'
import DataMapper from './DataMapper'

export default abstract class OrderMapper<T extends Order> implements DataMapper<T,OrderEntity> {
  
  abstract to(item: T): OrderEntity

  abstract from(data: OrderEntity): T
  
}