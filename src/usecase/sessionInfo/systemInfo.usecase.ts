import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { SessionInfoUsecaseModel } from '@usecase/sessionInfo/model/sessionInfo.usecase.model';

export class SessionInfoUsecase {

  SessionInfo:any;

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<SessionInfoUsecaseModel>  {
    try {
      const response:any = await this.inversify.ajaxService.post('', 
        {
          operationName: 'getSessionInfo',
          variables: {},
          query: `query getSessionInfo {  
            getSessionInfo {
              access_token
              id
              code
              name_first
              name_last
              description
              mail
              role
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.getSessionInfo
      }
    } catch (e: any) {
      return {
        message: CODES.FAIL,
        error: e.message
      }
    }
  }
}