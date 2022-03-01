import { readFileSync } from 'fs'
import Crawler from 'crawler'

describe('extract earnings from extract', () => {
  let content = ''
  beforeAll(() => {
    content = readFileSync(`${__dirname}/static/extract-sample.xml`).toString()
  })

  function executeCrawler(content: string): Promise<Crawler.CrawlerRequestResponse> {
    return new Promise((resolve, reject) => {
      const processor = new Crawler({
        maxConnections: 10,
        callback: (error, result, done) => {
          if (error) reject(error)
          else resolve(result)
        }
      })
      processor.queue({
        html: content
      })
    })
  }

  test('identify item of "rendimentos"', async () => {
    const result = await executeCrawler(content)
    const { $ } = result
    let date: Date
    const finalResult: Object[] = []
    $('.table-content__item').each((_, item) => {
      const description = $('.description > .description', item).text()
      if (description.includes('RENDIMENTO')) {
        const parts = description.trim().split(' ')
        const ticker = parts[parts.length-1]
        const totalText = $('.value > .value', item)
          .text()
          .replace(',', '.').replace(/^.\D/g,'')
        const totalAmount = Number(totalText)
        const valueDate = $('.operation > .date', item).text().split('/')
        date = new Date(`${valueDate[2]}-${valueDate[1]}-${valueDate[0]}`)
        finalResult.push({ date, ticker, totalAmount, type: 'rendimento' })
      } else if(description.includes('DIVIDENDOS')) {
        const parts = description.trim().split(' ')
        const ticker = parts[parts.length-1]
        const totalText = $('.value > .value', item)
          .text()
          .replace(',', '.').replace(/^.\D/g,'')
        const totalAmount = Number(totalText)
        const valueDate = $('.operation > .date', item).text().split('/')
        date = new Date(`${valueDate[2]}-${valueDate[1]}-${valueDate[0]}`)
        finalResult.push({ date, ticker, totalAmount, type: 'dividendo' })
      } else if(description.includes('JUROS S/CAPITAL')) {
        const parts = description.trim().split(' ')
        const ticker = parts[parts.length-1]
        const totalText = $('.value > .value', item)
          .text()
          .replace(',', '.').replace(/^.\D/g,'')
        const totalAmount = Number(totalText)
        const valueDate = $('.operation > .date', item).text().split('/')
        date = new Date(`${valueDate[2]}-${valueDate[1]}-${valueDate[0]}`)
        finalResult.push({ date, ticker, totalAmount, type: 'jscp' })
      }
    })
    console.log(`Found items: ${finalResult.length}`)
  })
})