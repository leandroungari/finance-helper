import { EarningDTO } from '../../useCases/GetEarningsFromExtractUseCase/GetEarningFromExtractDTO'

export default interface ExtractFileRepository {

  extractEarnings(xml: string): Promise<EarningDTO[]>
}