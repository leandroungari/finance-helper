import PurchaseOrder from './Orders/PurchaseOrder'
import SaleOrder from './Orders/SaleOrder'
import Position from './Position'
import Wallet from './Wallet'

let wallet: Wallet

describe('it represents the search of positions', () => {
  beforeEach(() => {
    wallet = new Wallet('test')
    wallet.setPositions([])
  })

  test('it retrieves the index of two elements set', () => {
    wallet.addOrReplacePosition(new Position('AAA3', 2, 12, 'BRL', new Date()))
    wallet.addOrReplacePosition(new Position('BBB3', 2, 12, 'BRL', new Date()))
    expect(wallet.getIndexFromTicker('AAA3')).toBe(0)
    expect(wallet.getIndexFromTicker('BBB3')).toBe(1)
    expect(wallet.getIndexFromTicker('CCC3')).toBe(-1)
  })

  test('it tries to retrieve an ended position', () => {
    const position = new Position('AAA3', 2, 12, 'BRL', new Date())
    position.setLastInvestment(new Date())
    wallet.addOrReplacePosition(position)
    expect(wallet.getPositionFromTicker('AAA3')).toBe(undefined)
  })

  test('it tries to retrieve a position by ticker', () => {
    const position = new Position('AAA3', 2, 12, 'BRL', new Date())
    wallet.addOrReplacePosition(position)
    expect(wallet.getPositionFromTicker('AAA3')).not.toBe(undefined)
  })

  test('it tries to retrieve a not existing position by ticker', () => {
    const position = new Position('AAA3', 2, 12, 'BRL', new Date())
    wallet.addOrReplacePosition(position)
    expect(wallet.getPositionFromTicker('BBB3')).toBe(undefined)
  })

})


describe('it represents the purchase and sells', () => {

  beforeEach(() => {
    wallet = new Wallet('test')
    wallet.setPositions([])
  })

  test('add a position', () => {
    const { position, isNewInvestiment } = wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 2, 12.0, 'BRL'))
    expect(isNewInvestiment).toBeTruthy()
    expect(position.getTotalCost()).toBe(24)
    expect(position.getQuantity()).toBe(2)
  })


  test('add two positions', () => {
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 2, 12.0, 'BRL'))
    const { position, isNewInvestiment } = wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 3, 15.0, 'BRL'))
    expect(isNewInvestiment).toBeFalsy()
    expect(position.getQuantity()).toBe(5)
    expect(position.getTotalCost()).toBe(69)
    expect(position.getAverageCost()).toBe(13.8)
  })

  test('add two positions and a sell', () => {
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 2, 12.0, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 3, 15.0, 'BRL'))
    const { position } = wallet.addNewInvestment(new SaleOrder('TEST3', new Date(), 3, 16, 'BRL'))
    expect(position.getQuantity()).toBe(2)
    expect(position.getAverageCost()).toBe(13.8)
    expect(position.getTotalSold()).toBe(48)
    expect(Number(position.getBalance().toFixed(2))).toBe(6.6)
  })

  test('add two positions and a sell with loss', () => {
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 2, 12.0, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 3, 15.0, 'BRL'))
    const { position } = wallet.addNewInvestment(new SaleOrder('TEST3', new Date(), 3, 13, 'BRL'))
    expect(position.getQuantity()).toBe(2)
    expect(position.getAverageCost()).toBe(13.8)
    expect(position.getTotalSold()).toBe(39)
    expect(Number(position.getBalance().toFixed(2))).toBe(-2.4)
  })


  test('add two positions, a sell with loss and a repurchase', () => {
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 2, 12.0, 'BRL'))
    const { position: firstPosition } = wallet
      .addNewInvestment(new PurchaseOrder('TEST3', new Date(), 3, 15.0, 'BRL'))
    expect(firstPosition.getQuantity()).toBe(5)
    const { position: beforeSell } = wallet
      .addNewInvestment(new SaleOrder('TEST3', new Date(), 3, 13, 'BRL'))
    expect(beforeSell.getQuantity()).toBe(2)
    const { position: afterSell } = wallet
      .addNewInvestment(new PurchaseOrder('TEST3', new Date(), 5, 18.0, 'BRL'))
    expect(afterSell.getQuantity()).toBe(7)
    expect(afterSell.getAverageCost()).toBe(16.8)
    expect(afterSell.getTotalSold()).toBe(39)
    expect(Number(afterSell.getBalance().toFixed(2))).toBe(-2.4)
  })

  test('simulate purchase of GRND3 items', () => {
    wallet.addNewInvestment(new PurchaseOrder('GRND3', new Date(), 10, 7.88, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('GRND3', new Date(), 20, 7.97, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('GRND3', new Date(), 10, 7.91, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('GRND3', new Date(), 7, 7.88, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('GRND3', new Date(), 14, 7.70, 'BRL'))
    wallet.addNewInvestment(new PurchaseOrder('GRND3', new Date(), 4.49, 0, 'BRL'))
    wallet.addNewInvestment(new SaleOrder('GRND3', new Date(), 15, 7.76, 'BRL'))
    wallet.addNewInvestment(new SaleOrder('GRND3', new Date(), 25, 7.63, 'BRL'))
    const { position } = wallet.addNewInvestment(new SaleOrder('GRND3', new Date(), 15, 7.43, 'BRL'))
    console.log(position)
  })

  test('add a position, sell the entire position and restart a new position on the same asset', () => {
    wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 10, 12, 'BRL'))
    const { position: zeroPosition } = wallet.addNewInvestment(new SaleOrder('TEST3', new Date(), 10, 10, 'BRL'))
    expect(zeroPosition.getQuantity()).toBe(0)
    expect(zeroPosition.getAverageCost()).toBe(12)
    expect(zeroPosition.getTotalSold()).toBe(100)
    expect(zeroPosition.getBalance()).toBe(-20)
    const { position: newPosition } = wallet.addNewInvestment(new PurchaseOrder('TEST3', new Date(), 20, 20, 'BRL'))
    expect(newPosition.getQuantity()).toBe(20)
    expect(newPosition.getAverageCost()).toBe(20)
    expect(newPosition.getTotalSold()).toBe(0)
    expect(newPosition.getBalance()).toBe(0)
  })

})

describe('merge positions of assets', () => {
  test('merge asset of two orders', () => {
    const wallet = new Wallet('test')
    const orders = [
      new PurchaseOrder('TEST3', new Date(), 1, 31.58, 'BRL'),
      new PurchaseOrder('TEST3', new Date(), 1, 33.85, 'BRL')
    ]
    const position = wallet.recalculatePosition(orders)
    expect(position.getAverageCost()).toBe(32.715)
    expect(position.getQuantity()).toBe(2)
  })
})