import Position from '../Position'
import PurchaseOrder from './PurchaseOrder'

describe('it represents some purchase orders', () => {

  test('it represents a purchase of a new position', () => {
    const position: Position | undefined = undefined
    const order = new PurchaseOrder('TEST3', new Date(), 2, 12.2, 'BRL')
    const newPosition = order.recalculate(position)
    expect(newPosition.getQuantity()).toBe(2)
    expect(newPosition.getAverageCost()).toBe(12.2)
    expect(newPosition.getTotalCost()).toBe(24.4)
  })

  test('it represents two purchase orders in a row', () => {
    let position: Position | undefined = undefined
    const firstOrder = new PurchaseOrder('TEST3', new Date(), 2, 12, 'BRL')
    const secondOrder = new PurchaseOrder('TEST3', new Date(), 3, 13, 'BRL')
    position = firstOrder.recalculate(position)
    expect(position.getQuantity()).toBe(2)
    expect(position.getAverageCost()).toBe(12)
    expect(position.getTotalCost()).toBe(24)
    position = secondOrder.recalculate(position)
    expect(position.getQuantity()).toBe(5)
    expect(position.getAverageCost()).toBe(12.6)
    expect(position.getTotalCost()).toBe(63)
  })
})