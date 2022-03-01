import NewPositionOrder from '../../entities/Orders/NewPositionOrder'
import { NewEnterpriseDTO, SpinOffDTO } from './RegisterSpinOffDTO'

export default class RegisterSpinOffUseCase {

  constructor() { }

  async execute(walletId: string, data: SpinOffDTO) {
    const { currency, date, origin, spin } = data
    const orderNewEnterprise = this.createOrderOfSpinOff(spin, currency, date)
  }

  private createOrderOfSpinOff(data: NewEnterpriseDTO, currency: string, date: Date) {
    return new NewPositionOrder(data.ticker, date, data.quantity, data.averagePrice, currency)
  }
}