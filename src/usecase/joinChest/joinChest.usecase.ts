import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { JoinChestUsecaseDto } from '@usecase/joinChest/joinChest.usecase.dto';
import { JoinChestUsecaseModel } from '@usecase/joinChest/joinChest.usecase.model';

export class JoinChestUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: JoinChestUsecaseDto): Promise<JoinChestUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'join_chest',
          variables: dto,
          query: `mutation join_chest($chest_id: String!) {
            join_chest (
              dto: {
                chest_id: $chest_id
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
          message: CODES.JOIN_CHEST_FAIL,
          error: e.message
        }
      }
    }
  }
}