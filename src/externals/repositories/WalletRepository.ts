export default interface WalletRepository {

  createWallet(id: string, owner: string): Promise<boolean>
}