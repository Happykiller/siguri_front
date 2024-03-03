import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { GetThingUsecaseDto } from '@usecase/getThing/getThing.usecase.dto';
import { GetThingUsecaseModel } from '@usecase/getThing/getThing.usecase.model';

export class GetThingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetThingUsecaseDto): Promise<GetThingUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'thing',
          variables: dto,
          query: `query thing($thing_id: String!, $chest_secret: String!) {
            thing (
              dto: {
                thing_id: $thing_id
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
        data: response.data.thing
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_THING_FAIL,
          error: e.message
        }
      }
    }
  }
}