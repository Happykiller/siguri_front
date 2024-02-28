import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { CreateChestUsecaseDto } from '@usecase/createChest/createChest.usecase.dto';
import { CreateChestUsecaseModel } from '@usecase/createChest/createChest.usecase.model';

export class CreateChestUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: CreateChestUsecaseDto): Promise<CreateChestUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'create_chest',
          variables: dto,
          query: `mutation create_chest($label: String!, $secret: String!, $description: String!) {
            create_chest (
              dto: {
                label: $label
                secret: $secret
                description: $description
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
        data: response.data.create_chest
      }
    } catch (e: any) {
      return {
        message: CODES.CREATE_CHEST_FAIL,
        error: e.message
      }
    }
  }
}