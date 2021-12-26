import BrokageNotesRepository from '../../repositories/BrokageNotesRepository'

import {
  BrokageNote,
  FinancialProperties,
  Order,
  OrderType,
} from './ExtractOrdersDTO'

import TickerConverter from './TickerConverter'

export default class ExtractOrdersUseCase {

  private static readonly UNUSED_EXPRESSIONS = [
    'FRACIONARIO',
    'VISTAFII',
    '#'
  ]

  private converter: TickerConverter

  constructor(
    private brokageNotesRepository: BrokageNotesRepository
  ) {
    this.converter = new TickerConverter()
  }

  public execute(item: BrokageNote) {
    const data = this.brokageNotesRepository.retrieveDataFromNote(item)
    const cleanedRows = this.filterRowsWithOrdersInformation(data.rows)
    return this.extractOrderFromRows(cleanedRows, item.date)
  }

  private filterRowsWithOrdersInformation(rows: string[]) {
    return rows.filter((item) => item.includes('1-BOVESPA'))
      .map((item) => item.replace('1-BOVESPA', ''))
  }

  private extractOrderFromRows(rows: string[], date: string) {
    return rows.map((row) => this.extractOrderFromRow(row, date))
  }

  private extractOrderFromRow(row: string, date: string): Order {
    const type = this.identifyOrderType(row)
    const cleanedRow = this.cleanUnusedExpression(row)
    const properties = this.getFinancialProperties(cleanedRow)
    return {
      type,
      date,
      ...properties
    }
  }

  private identifyOrderType(row: string): OrderType {
    return row.startsWith('C') ? 'buy' : 'sell'
  }

  private cleanUnusedExpression(row: string) {
    for (let i = 0; i < ExtractOrdersUseCase.UNUSED_EXPRESSIONS.length; i++) {
      row = row.replace(ExtractOrdersUseCase.UNUSED_EXPRESSIONS[i], '')
    }
    return row
  }

  private getFinancialProperties(row: string): FinancialProperties {
    const parts = row.split(' ').filter((a) => a.trim().length > 0).map((a) => a.trim())
    let value = parts.pop()!
    value = value!.substring(2, value!.length - 1)
    let description = parts.join(' ')
    description = this.converter.convert(description)

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

    return {
      description,
      quantity,
      unitaryPrice,
      totalPrice
    }
  }
}