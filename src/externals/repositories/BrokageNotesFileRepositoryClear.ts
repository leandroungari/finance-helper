import { UploadedFile } from 'express-fileupload'
import { readFileSync } from 'fs'
import pdf from 'pdf-parse'
import Order, { OrderType } from '../../entities/Order'
import Wallet from '../../entities/Wallet'
import { FinancialProperties } from '../../useCases/ExtractOrdersUseCase/ExtractOrdersDTO'
import BrokageNotesFileRepository from './BrokageNotesFileRepository'
import TickerMappingsRepository from './TickerMappingsRepository'
import TickerMappingsRepositoryPostgres from './TickerMappingsRepositoryPostgres'

export default class BrokageNotesFileRepositoryClear
  implements BrokageNotesFileRepository {

  private tickerMappingsRepository: TickerMappingsRepository

  constructor() {
    this.tickerMappingsRepository = new TickerMappingsRepositoryPostgres()
  }

  private static readonly UNUSED_EXPRESSIONS = [
    'FRACIONARIO',
    'VISTAFII',
    '#',
    'ED'
  ]

  private static readonly DEFAULT_CURRENCY = 'BRL'


  async extractOrders(wallet: Wallet, date: string): Promise<Order[]> {
    const rows = await this.extractRows(wallet, date)
    const cleanedRows = this.filterRowsWithOrdersInformation(rows)
    const orders = await this.extractOrderFromRows(cleanedRows, date)
    return orders
  }


  async extractRows(wallet: Wallet, date: string): Promise<string[]> {
    const directory = process.env.BROKAGE_NOTES_DIR
    const path = `${directory}/${wallet.getId()}/${date}.pdf`
    const input = readFileSync(path)
    const result = await pdf(input)
    return result.text.split('\n')
  }


  private filterRowsWithOrdersInformation(rows: string[]) {
    return rows.filter((item) => item.includes('1-BOVESPA'))
      .map((item) => item.replace('1-BOVESPA', ''))
  }

  private async extractOrderFromRows(rows: string[], date: string) {
    const orders: Order[] = []
    for(const row of rows) {
      const item = await this.extractOrderFromRow(row, date)
      orders.push(item)
    }
    return orders
  }

  private async extractOrderFromRow(row: string, date: string): Promise<Order> {
    const type = this.identifyOrderType(row)
    const cleanedRow = this.cleanUnusedExpresssion(row)
    const properties = await this.getFinancialProperties(cleanedRow)
    return new Order(
      properties.description,
      properties.unitaryPrice,
      properties.quantity,
      properties.totalPrice,
      BrokageNotesFileRepositoryClear.DEFAULT_CURRENCY,
      type,
      date,
    )
  }



  private identifyOrderType(row: string): OrderType {
    return row.startsWith('C') ? 'buy' : 'sell'
  }


  private cleanUnusedExpresssion(row: string) {
    row = row.substring(1, row.length).replace('#', '')
    for (let i = 0; i < BrokageNotesFileRepositoryClear.UNUSED_EXPRESSIONS.length; i++) {
      row = row.replace(BrokageNotesFileRepositoryClear.UNUSED_EXPRESSIONS[i], '')
    }
    return row
  }


  private async getFinancialProperties(row: string): Promise<FinancialProperties> {
    const parts = row.split(' ').filter((a) => a.trim().length > 0).map((a) => a.trim())
    let value = parts.pop()!
    value = value!.substring(2, value!.length - 1)
    let description = parts.join(' ')
    description = await this.tickerMappingsRepository.getMappedTicker(description)
    const splitPoint = value.indexOf(',')
    let quantity = Number(value.substring(0, 1))
    let unitaryPrice = Number(value.substring(1, splitPoint + 3).replace(',', '.'))
    let totalPrice = Number(value.substring(splitPoint + 3, value.length).replace(',', '.'))
    let size = 1
    while (Math.abs(quantity * unitaryPrice - totalPrice) >= 0.01) {
      size++
      quantity = Number(value.substring(0, size))
      unitaryPrice = Number(value.substring(size, splitPoint + 3).replace(',', '.'))
    }
    if (Number.isNaN(quantity)) {
      quantity = Number(value.substring(1, 2))
      unitaryPrice = Number(value.substring(2, splitPoint + 3).replace(',', '.'))
      totalPrice = Number(value.substring(splitPoint + 3, value.length).replace(',', '.'))
      size = 2
      while (Math.abs(quantity * unitaryPrice - totalPrice) >= 0.01) {
        size++
        quantity = Number(value.substring(1, size))
        unitaryPrice = Number(value.substring(size, splitPoint + 3).replace(',', '.'))
      }
    }
    return {
      description,
      quantity,
      unitaryPrice,
      totalPrice
    }
  }

  async upload(walletId: string, files: UploadedFile[]): Promise<string[]> {
    try {
      const dates = []
      for (const file of files) {
        await file.mv(`${process.env.BROKAGE_NOTES_DIR}/${walletId}/${file.name}`)
        dates.push(file.name)
      }
      return dates
    } catch (err) {
      throw err
    }
  }


}