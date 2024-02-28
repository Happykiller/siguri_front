import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';

export class GetChestsUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<GetChestsUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'chestsForUser',
          variables: {},
          query: `query chestsForUser {
            chestsForUser {
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
        data: response.data.chestsForUser
      }
    } catch (e: any) {
      return {
        message: CODES.GET_CHESTS_FAIL,
        error: e.message
      }
    }
  }
}