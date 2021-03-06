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

  async markNotesAsProcessed(walletId: string, date: Date): Promise<boolean> {
    try {
      await this.connection.brokageNotes.update({
        where: {
          walletId_date: {
            walletId: walletId,
            date: date
          }
        },
        data: {
          processed: BrokageNoteStatus.DONE
        }
      })
    } catch (error) {
      throw new Error(`Fail to update status of brokage notes as processed: ${error} - ${date}`)
    } finally {
      this.disconnect()
    }
    return true
  }


  async getNotProcessedNotes(walletId: string, limit: number): Promise<Date[]> {
    let dates: Date[] = []
    try {
      const result = await this.connection.brokageNotes.findMany({
        where: {
          processed: BrokageNoteStatus.NOT_PROCESSED,
          walletId: walletId
        },
        orderBy: {
          date: 'asc'
        },
        take: limit
      })
      dates = result.map((item) => item.date)
    } catch (err) {
      throw new Error(`Fail to retrive not-processed brokage notes: ${err}`)
    } finally {
      this.disconnect()
    }
    return dates
  }



  async registerNotes(walletId: string, dates: Date[]): Promise<boolean> {
    try {
      const items = dates.map((date) => ({
        processed: BrokageNoteStatus.NOT_PROCESSED,
        walletId,
        date
      }))
      await this.connection.brokageNotes.createMany({
        data: items,
        skipDuplicates: true
      })
    } catch (err) {
      throw err
    } finally {
      this.disconnect()
    }
    return true
  }



}