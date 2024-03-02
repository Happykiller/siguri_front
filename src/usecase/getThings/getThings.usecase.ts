import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';
import { GetThingsUsecaseDto } from '@usecase/getThings/getThings.usecase.dto';
import { GetThingsUsecaseModel } from '@usecase/getThings/getThings.usecase.model';

export class GetThingsUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetThingsUsecaseDto): Promise<GetThingsUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'thingsForChest',
          variables: dto,
          query: `query thingsForChest($chest_id: String!, $chest_secret: String!) {
            thingsForChest (
              dto: {
                chest_id: $chest_id
                chest_secret: $chest_secret
              }
            ) 
            {
              id
              label
              description
              author {
                id
                code
              }
              chest {
                id
                label
              }
              type
              cb {
                code
                label
                number
                expiration_date
                crypto
              }
              code {
                code
              }
              credential {
                id
                password
                address
              }
              note {
                note
              }
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.thingsForChest.sort((elt1:ThingUsecaseModel, elt2:ThingUsecaseModel) => elt1.label.localeCompare(elt2.label))
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_THINGS_FAIL,
          error: e.message
        }
      }
    }
  }
}