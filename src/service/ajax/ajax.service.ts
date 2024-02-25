export default abstract class AjaxService {
  abstract post(url:string, datas: any): Promise<any>;
}