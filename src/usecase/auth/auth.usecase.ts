import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { AuthUsecaseDto } from '@src/usecase/auth/dto/auth.usecase.dto';
import { AuthUsecaseModel } from '@src/usecase/auth/model/auth.usecase.model';

export class AuthUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: AuthUsecaseDto): Promise<AuthUsecaseModel>  {
    try {
      const response:any = await this.inversify.ajaxService.post('graphql', 
        {
          operationName: 'auth',
          variables: dto,
          query: `query auth($login: String!, $password: String!) {
            auth (
              dto: {
                login: $login
                password: $password
              }
            ) {
              accessToken
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
        data: response.data.auth
      }
    } catch (e: any) {
      return {
        message: CODES.AUTH_FAIL_WRONG_CREDENTIAL,
        error: e.message
      }
    }
  }
}