import { EarningDTO } from '../../useCases/GetEarningsFromExtractUseCase/GetEarningFromExtractDTO'

export default interface EarningsRepository {

  saveEarnings(walletId: string, earnings: EarningDTO[]): Promise<boolean>
}