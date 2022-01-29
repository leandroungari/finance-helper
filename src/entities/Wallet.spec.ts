import Order from './Order'
import Wallet from './Wallet'

let wallet: Wallet

describe('it represents the purchase and sells', () => {

  beforeEach(() => {
    wallet = new Wallet('test')
    wallet.setPositions([])
  })

  test('add a position', () => {
    const { position } = wallet.addNewInvestment('TEST3', 2, 12.0, 'BRL', 'buy', new Date())
    expect(position.getTotalCost()).toBe(24)
    expect(position.getQuantity()).toBe(2)
  })


  test('add two positions', () => {
    wallet.addNewInvestment('TEST3', 2, 12.0, 'BRL', 'buy', new Date())
    const { position } = wallet.addNewInvestment('TEST3', 3, 15.0, 'BRL', 'buy', new Date())
    expect(position.getQuantity()).toBe(5)
    expect(position.getTotalCost()).toBe(69)
    expect(position.getAverageCost()).toBe(13.8)
  })

  test('add two positions and a sell', () => {
    wallet.addNewInvestment('TEST3', 2, 12.0, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('TEST3', 3, 15.0, 'BRL', 'buy', new Date())
    const { position } = wallet.addNewInvestment('TEST3', 3, 16, 'BRL', 'sell', new Date())
    expect(position.getQuantity()).toBe(2)
    expect(position.getAverageCost()).toBe(13.8)
    expect(position.getTotalSold()).toBe(48)
    expect(Number(position.getBalance().toFixed(2))).toBe(6.6)
  })

  test('add two positions and a sell with loss', () => {
    wallet.addNewInvestment('TEST3', 2, 12.0, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('TEST3', 3, 15.0, 'BRL', 'buy', new Date())
    const { position } = wallet.addNewInvestment('TEST3', 3, 13, 'BRL', 'sell', new Date())
    expect(position.getQuantity()).toBe(2)
    expect(position.getAverageCost()).toBe(13.8)
    expect(position.getTotalSold()).toBe(39)
    expect(Number(position.getBalance().toFixed(2))).toBe(-2.4)
  })


  test('add two positions, a sell with loss and a repurchase', () => {
    wallet.addNewInvestment('TEST3', 2, 12.0, 'BRL', 'buy', new Date())
    const { position: firstPosition } = wallet.addNewInvestment('TEST3', 3, 15.0, 'BRL', 'buy', new Date())
    expect(firstPosition.getQuantity()).toBe(5)
    const { position: beforeSell } = wallet.addNewInvestment('TEST3', 3, 13, 'BRL', 'sell', new Date())
    expect(beforeSell.getQuantity()).toBe(2)
    const { position: afterSell } = wallet.addNewInvestment('TEST3', 5, 18.0, 'BRL', 'buy', new Date())
    expect(afterSell.getQuantity()).toBe(7)
    expect(afterSell.getAverageCost()).toBe(16.8)
    expect(afterSell.getTotalSold()).toBe(39)
    expect(Number(afterSell.getBalance().toFixed(2))).toBe(-2.4)
  })

  test('simulate purchase of GRND3 items', () => {
    wallet.addNewInvestment('GRND3', 10, 7.88, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('GRND3', 20, 7.97, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('GRND3', 10, 7.91, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('GRND3', 7, 7.88, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('GRND3', 14, 7.70, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('GRND3', 4, 7.49, 'BRL', 'buy', new Date())
    wallet.addNewInvestment('GRND3', 15, 7.76, 'BRL', 'sell', new Date())
    wallet.addNewInvestment('GRND3', 25, 7.63, 'BRL', 'sell', new Date())
    const { position } = wallet.addNewInvestment('GRND3', 15, 7.43, 'BRL', 'sell', new Date())
    console.log(position)
  })

  test('add a position, sell the entire position and restart a new position on the same asset', () => {
    wallet.addNewInvestment('TEST3', 10, 12, 'BRL', 'buy', new Date())
    const { position: zeroPosition } = wallet.addNewInvestment('TEST3', 10, 10, 'BRL', 'sell', new Date())
    expect(zeroPosition.getQuantity()).toBe(0)
    expect(zeroPosition.getAverageCost()).toBe(12)
    expect(zeroPosition.getTotalSold()).toBe(100)
    expect(zeroPosition.getBalance()).toBe(-20)
    const { position: newPosition } = wallet.addNewInvestment('TEST3', 20, 20, 'BRL', 'buy', new Date())
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
      new Order('TEST3', 31.58, 1, 31.58, 'BRL', 'buy', '2022-01-23'),
      new Order('TEST3', 33.85, 1, 33.85, 'BRL', 'buy', '2022-01-23')
    ]
    const position = wallet.recalculatePosition('TEST3', orders)
    expect(position.getAverageCost()).toBe(32.715)
    expect(position.getQuantity()).toBe(2)
  })
})