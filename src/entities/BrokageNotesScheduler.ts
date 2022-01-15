import Wallet from './Wallet'

export default class BrokageNoteScheduler {
  private wallet: Wallet
  private dates: string[]

  constructor(walletId: string) {
    this.wallet = new Wallet(walletId)
    this.dates = []
  }

  public addNote(date: string) {
    if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) 
      throw new Error('Invalid date.')
    this.dates.push(date)
  }

  public getWallet() {
    return this.wallet
  }

  public getDates() {
    return this.dates
  }
}