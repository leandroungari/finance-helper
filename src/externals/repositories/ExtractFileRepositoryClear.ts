import Crawler from 'crawler'
import { EarningDTO, EarningTypeDTO } from '../../useCases/GetEarningsFromExtractUseCase/GetEarningFromExtractDTO'
import ExtractFileRepository from './ExtractFileRepository'


export default class ExtractFileRepositoryClear
  implements ExtractFileRepository {

  private executeCrawler(content: string): Promise<Crawler.CrawlerRequestResponse> {
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

  private identifyEarningType(description: string): EarningTypeDTO | undefined {
    if (description.includes('RENDIMENTO')) {
      return 'rendimento'
    } else if (description.includes('DIVIDENDOS')) {
      return 'dividendo'
    } else if (description.includes('JUROS S/CAPITAL')) {
      return 'jscp'
    } else if (description.includes('CRÉDITO FRAÇÕES')) {
      return 'cred-frac'
    }
    return undefined
  }

  public async extractEarnings(xml: string): Promise<EarningDTO[]> {
    const { $ } = await this.executeCrawler(xml)
    let date: Date
    const result: EarningDTO[] = []
    $('.table-content__item').each((_, item) => {
      const description = $('.description > .description', item).text()
      const type = this.identifyEarningType(description)
      if (type !== undefined) {
        const parts = description.trim().split(' ')
        const ticker = parts[parts.length - 1]
        const totalText = $('.value > .value', item)
          .text()
          .replace(',', '.').replace(/^.\D/g, '')
        const totalAmount = Number(totalText)
        const valueDate = $('.operation > .date', item).text().split('/')
        date = new Date(`${valueDate[2]}-${valueDate[1]}-${valueDate[0]}`)
        result.push({ type, date, ticker, value: totalAmount, currency: 'BRL' })
      }
    })
    return result
  }

}
