import BrokageNotesRepository from './BrokageNotesRepository'
import Postgres from './connection/Postgres'

enum BrokageNoteStatus {
  NOT_PROCESSED = 'not-processed',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  ERROR = 'error'
}

export default class BrokageNotesRepositoryPostgres
  extends Postgres
  implements BrokageNotesRepository {

  constructor() {
    super()
  }


  async registerNotes(walletId: string, dates: Date[]): Promise<boolean> {
    try {
      const items = dates.map((date) => ({
        processed: BrokageNoteStatus.NOT_PROCESSED,
        walletId,
        date
      }))
      await this.connection.brokageNotes.createMany({
        data: items
      })
    } catch(err) {
      throw err
    } finally {
      this.disconnect()
    }
    return true
  }



}