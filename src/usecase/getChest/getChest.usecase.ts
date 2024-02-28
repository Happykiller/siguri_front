import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { GetChestUsecaseDto } from '@usecase/getChest/getChest.usecase.dto';
import { GetChestUsecaseModel } from '@usecase/getChest/getChest.usecase.model';

export class GetChestUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetChestUsecaseDto): Promise<GetChestUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'chest',
          variables: dto,
          query: `query chest($id: String!, $secret: String!) {
            chest (
              dto: {
                id: $id
                secret: $secret
              }
            ) {
              id
              label
              description
              author_id
              author {
                id
                code
              }
              members {
                user_id
                user {
                  id
                  code
                }
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
        data: response.data.chest
      }
    } catch (e: any) {
      return {
        message: CODES.GET_CHEST_FAIL,
        error: e.message
      }
    }
  }
}