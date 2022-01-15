import Order from '../../entities/Order'
import Wallet from '../../entities/Wallet'
import BrokageNotesFileRepository from '../../externals/repositories/BrokageNotesFileRepository'
import OrdersRepository from '../../externals/repositories/OrdersRepository'
import PositionsRepository from '../../externals/repositories/PositionsRepository'


export default class ExtractOrdersUseCase {

  constructor(
    private brokageNotesFileRepository: BrokageNotesFileRepository,
    private ordersRepository: OrdersRepository,
    private positionsRepository: PositionsRepository
  ) { }

  public async execute(walletId: string, date: string) {
    const wallet = new Wallet(walletId)
    const orders = await this.extractOrdersFromNote(wallet, date)
    await this.ordersRepository.save(wallet, orders)
    await this.updatePositionsInWallet(wallet, orders)
    return orders
  }

  private async extractOrdersFromNote(wallet: Wallet, date: string) {
    return await this.brokageNotesFileRepository.extractOrders(wallet, date)
  }

  private async updatePositionsInWallet(wallet: Wallet, orders: Order[]) {
    const positions = await this.positionsRepository.getAllPositionsFromWallet(wallet.getId())
    wallet.setPositions(positions)
    for (const order of orders) {
      const { isNewInvestiment, position } = wallet
        .addNewInvestment(order.getDescription(), order.getQuantity(), order.getUnitaryPrice())
      if (isNewInvestiment) {
        await this.positionsRepository.save(wallet.getId(), position)
      } else {
        await this.positionsRepository.update(wallet.getId(), position)
      }
    }
  }

}