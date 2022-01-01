import express, {
  Request,
  Response,
} from 'express'
import HttpException from './http/HttpException'

import StatusCode from './http/StatusCode'

type HTTPVerb = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'option'

export default class Router {
  private instance: express.Router
  private name: string

  constructor(name: string) {
    this.instance = express.Router()
    this.name = name
  }

  public getName() {
    return this.name
  }

  public getInstance() {
    return this.instance
  }

  private handleException(exception: any, res: Response) {
    if (exception instanceof HttpException) {
      res.status(exception.statusCode).json({
        message: exception.message,
        stackTrace: exception.stack
      })
    } else if (exception instanceof Error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: exception.message,
        stackTrace: exception.stack
      })
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: exception + '' ?? 'Unexpected Error',
      })
    }
  }

  private async handleRequest(req: Request, res: Response, verb: HTTPVerb, action: (req: Request, res: Response) => Promise<any>) {
    try {
      const result = await action(req, res)
      if (verb === 'post') {
        res.status(StatusCode.CREATED).json(result)
      } else {
        res.status(StatusCode.SUCCESS).json(result)
      }
    } catch (exception) {
      this.handleException(exception, res)
    }
  }

  private handler(verb: HTTPVerb, name: string, action: (req: Request, res: Response) => Promise<any>) {
    switch (verb) {
      case 'get':
        this.instance.get(name, async (req, res) => this.handleRequest(req, res, verb, action))
        break
      case 'post':
        this.instance.post(name, async (req, res) => this.handleRequest(req, res, verb, action))
        break
      case 'put':
        this.instance.put(name, async (req, res) => this.handleRequest(req, res, verb, action))
        break
      case 'patch':
        this.instance.patch(name, async (req, res) => this.handleRequest(req, res, verb, action))
        break
      case 'delete':
        this.instance.delete(name, async (req, res) => this.handleRequest(req, res, verb, action))
        break

    }
  }

  public get(name: string, action: (req: Request, res: Response) => Promise<any> | any) {
    this.handler('get', name, action)
  }

  public post(name: string, action: (req: Request, res: Response) => Promise<any> | any) {
    this.handler('post', name, action)
  }

  public put(name: string, action: (req: Request, res: Response) => Promise<any> | any) {
    this.handler('put', name, action)
  }

  public patch(name: string, action: (req: Request, res: Response) => Promise<any> | any) {
    this.handler('patch', name, action)
  }

  public delete(name: string, action: (req: Request, res: Response) => Promise<any> | any) {
    this.handler('delete', name, action)
  }

}