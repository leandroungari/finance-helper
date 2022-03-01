import AdjustmentPositionOrder from '../../entities/Orders/AdjustmentPositionOrder'
import BonusOrder from '../../entities/Orders/BonusOrder'
import NewPositionOrder from '../../entities/Orders/NewPositionOrder'
import Order, { OrderTypeCode } from '../../entities/Orders/Order'
import PurchaseOrder from '../../entities/Orders/PurchaseOrder'
import SaleOrder from '../../entities/Orders/SaleOrder'
import Wallet from '../../entities/Wallet'
import AdjustmentPositionOrderMapper from '../mappers/AdjustmentOrderMapper'
import BonusOrderMapper from '../mappers/BonusOrderMapper'
import NewPositionOrderMapper from '../mappers/NewPositionOrderMapper'
import OrderMapper from '../mappers/OrderMapper'
import PurchaseOrderMapper from '../mappers/PurchaseOrderMapper'
import SaleOrderMapper from '../mappers/SaleOrderMapper'
import Postgres from './connection/Postgres'
import OrdersRepository from './OrdersRepository'
import { Order as OrderDB } from '@prisma/client'

export default class OrdersRepositoryPostgres
  extends Postgres
  implements OrdersRepository {

  private orderMappers: { [key: string]: OrderMapper<Order> }

  constructor() {
    super()
    this.orderMappers = {
      'B': new PurchaseOrderMapper(),
      'S': new SaleOrderMapper(),
      'N': new NewPositionOrderMapper(),
      'O': new BonusOrderMapper(),
      'A': new AdjustmentPositionOrderMapper()
    }
  }

  async getOrdersInInterval(walletId: string, from: Date, to: Date): Promise<Order[]> {
    let orders: Order[] = []
    try {
      const items = await this.connection.order.findMany({
        where: {
          wallet: walletId,
          date: {
            gt: from,
            lte: to
          }
        }
      })
      orders = items.map((item) => this.convertItemToOrder(item))
    } catch (error) {
      throw new Error(`Fail to retrieve the orders: ${error}`)
    }
    return orders
  }

  private convertItemToOrder(item: OrderDB) {
    return this.orderMappers[item.type].from({
      date: item.date,
      description: item.description,
      currency: item.currency ?? undefined,
      quantity: item.quantity ?? undefined,
      rate: item.rate ?? undefined,
      unitaryPrice: item.unitaryPrice ?? undefined,
      totalPrice: item.totalPrice ?? undefined,
      type: <OrderTypeCode>item.type
    })
  }

  async getOrdersByTickerInInterval(walletId: string, ticker: string, from?: Date, to?: Date): Promise<Order[]> {
    if (from && to) {
      let orders: Order[] = []
      try {
        const items = await this.connection.order.findMany({
          where: {
            wallet: walletId,
            description: ticker,
            date: {
              gt: from,
              lte: to
            }
          }
        })
        orders = items.map((item) => this.convertItemToOrder(item))
      } catch (error) {
        throw new Error(`Fail to retrieve the orders: ${error}`)
      }
      return orders
    } else {
      return await this.getOrdersByTicker(walletId, ticker)
    }
  }

  async getOrdersByTicker(walletId: string, ticker: string): Promise<Order[]> {
    let result: Order[] = []
    try {
      const items = await this.connection.order.findMany({
        where: {
          description: ticker
        },
        orderBy: {
          date: 'asc'
        }
      })
      result = items.map((item) => this.convertItemToOrder(item))
    } catch (error) {
      throw new Error(`Cannot retrieve the orders of asset ${walletId}/${ticker}: ${error}`)
    } finally {
      this.disconnect()
    }
    return result
  }

  async replaceTickerFromOrders(walletId: string, from: string, to: string): Promise<boolean> {
    try {
      await this.connection.order.updateMany({
        where: {
          description: from,
          wallet: walletId
        },
        data: {
          description: to
        }
      })
    } catch (error) {
      throw new Error(`Cannot update the ticker of orders from ${from} to ${to}: ${error}`)
    } finally {
      this.disconnect()
    }
    return true
  }

  async save(wallet: Wallet, orders: Order[]): Promise<boolean> {
    const items = orders.map((order) => this.orderMappers[order.getType()].to(order))
    try {
      const { count } = await this.connection.order.createMany({ data: items })
      if (count === 0) {
        throw new Error('None register was inserted!')
      }
    } catch (error) {
      throw new Error(`Fail to insert the orders: ${error} - ${JSON.stringify(items)}`)
    } finally {
      this.disconnect()
    }
    return true
  }

}