import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import UpdateChestUsecaseDto from '@usecase/updateChest/updateChest.usecase.dto';
import UpdateChestUsecaseModel from '@usecase/updateChest/updateChest.usecase.model';

export class UpdateChestUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: UpdateChestUsecaseDto): Promise<UpdateChestUsecaseModel>  {
    try {
      const newDto:any = {
        ... dto,
        chest_id: dto.id
      };

      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'update_chest',
          variables: newDto,
          query: `mutation update_chest(
            $chest_id: String!, 
            $label: String!,
            $description: String!,
          ) {
            update_chest (
              dto: {
                chest_id: $chest_id
                label: $label
                description: $description
              }
            ) 
            {
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
        data: response.data.update_chest
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.UPDATE_THING_FAIL,
          error: e.message
        }
      }
    }
  }
}