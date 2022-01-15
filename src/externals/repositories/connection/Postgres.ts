import { PrismaClient } from '@prisma/client'

export default class Postgres {
  protected connection: PrismaClient

  constructor() {
    this.connection = new PrismaClient()
  }

  disconnect() {
    this.connection.$disconnect()
  }
}