import yahooFinance from 'yahoo-finance2'

describe('retrieving quotes of stocks', () => {

  test('retrieving quote of WEGE3', async () => {
    const item = await yahooFinance.quote('WEGE3.SA')
    const result = {
      currentPrice: item.regularMarketPrice,
      currency: item.currency
    }
    console.log(result)
  })


  test('retrieving quote of AAPL', async () => {
    const item = await yahooFinance.quote('AAPL')
    const result = {
      currentPrice: item.regularMarketPrice,
      currency: item.currency
    }
    console.log(result)
  })
})