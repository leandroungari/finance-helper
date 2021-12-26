import { Request, Response } from 'express'

export default abstract class Controller<T = void> {
  constructor(
    protected request: Request,
    protected response: Response
  ) {}

  abstract handle(data: T): Promise<void>;
}