import axios, { AxiosStatic } from 'axios'

export default abstract class Request<T> {
  protected instance: AxiosStatic

  constructor() {
    this.instance = axios  
  }

  abstract handle(): Promise<T>;
}