import { Request, Response } from 'express'
import Controller from '../../core/Controller'

export default class ExtractOrdersController extends Controller {

  constructor(request: Request, response: Response) {
    super(request, response)
  }
  
  async handle() {
    this.response.status(200).json({
      message: 'Hello World'
    })
  }

}