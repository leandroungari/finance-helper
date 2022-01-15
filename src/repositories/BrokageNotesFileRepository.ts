import { UploadedFile } from 'express-fileupload'
import Order from '../entities/Order'
import Wallet from '../entities/Wallet'

export default interface BrokageNotesFileRepository {

  extractOrders(wallet: Wallet, date: string): Promise<Order[]>

  upload(walletId: string, files: UploadedFile[]): Promise<string[]>
}