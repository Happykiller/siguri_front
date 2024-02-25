import config from '@src/config';
import { Inversify } from '@src/common/inversify';
import AjaxService from './ajax.service';

export class AjaxServiceReal implements AjaxService {

  constructor(
    private inversify:Inversify
  ){}

  async post(url:string, datas: any): Promise<any> {
    try {
      const storage = JSON.parse(sessionStorage.getItem("siguri-storage"));
      const token = storage?.state.access_token;

      const response = await fetch(config.api_url + url, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token??'token'}`
        },
        body: JSON.stringify(datas)
      });

      const responseJson = response.json();

      return responseJson;
    } catch(e:any) {
      this.inversify.loggerService.error(e.message);
    }
  }
} 