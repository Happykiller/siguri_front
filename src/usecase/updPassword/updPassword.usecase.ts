import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import UpdPasswordUsecaseDto from '@usecase/updPassword/updPassword.usecase.dto';
import { UpdPasswordUsecaseModel } from '@usecase/updPassword/updPassword.usecase.model';

export class UpdPasswordUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: UpdPasswordUsecaseDto): Promise<UpdPasswordUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'update_password',
          variables: dto,
          query: `mutation update_password (
            $old_value: String!
            $new_value: String!,
            $conf_value: String!
          ) {
            update_password (
              dto: {
                old_value: $old_value
                new_value: $new_value
                conf_value: $conf_value
              }
            ) 
            {
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
        data: response.data.update_password
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.UPDATE_PASSWORD_FAIL,
          error: e.message
        }
      }
    }
  }
}