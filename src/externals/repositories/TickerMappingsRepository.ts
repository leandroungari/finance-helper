export type Mappings = { [description: string]: string }

export default interface TickerMappingsRepository {

  createMapping(description: string, ticker: string): Promise<boolean>

  getMappedTicker(description: string): Promise<string>
}