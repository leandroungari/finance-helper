import Postgres from './connection/Postgres'
import WalletRepository from './WalletRepository'

export default class WalletRepositoryPostgres
  extends Postgres
  implements WalletRepository {
  
  async createWallet(id: string, owner: string): Promise<boolean> {
    try {
      await this.connection.wallet.create({
        data: {
          id,
          owner,
          createAt: new Date()
        }
      })
    } catch(error) {  
      throw new Error(`Failure to create the wallet: ${error}`)
    } finally {
      this.disconnect()
    }
    return true
  }

}