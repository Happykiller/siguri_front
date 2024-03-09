import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import DeleteThingUsecaseDto from '@usecase/deleteThing/deleteThing.usecase.dto';
import DeleteThingUsecaseModel from '@usecase/deleteThing/deleteThing.usecase.model';

export class DeleteThingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: DeleteThingUsecaseDto): Promise<DeleteThingUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'delete_thing',
          variables: dto,
          query: `mutation delete_thing($thing_id: String!, $chest_secret: String!) {
            delete_thing (
              dto: {
                thing_id: $thing_id
                chest_secret: $chest_secret
              }
            ) 
            {
              id
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: true
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