import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { LeaveChestUsecaseDto } from '@usecase/leaveChest/leaveChest.usecase.dto';
import { LeaveChestUsecaseModel } from '@usecase/leaveChest/leaveChest.usecase.model';

export class LeaveChestUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: LeaveChestUsecaseDto): Promise<LeaveChestUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'leave_chest',
          variables: dto,
          query: `mutation leave_chest($chest_id: String!) {
            leave_chest (
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
          message: CODES.LEAVE_CHEST_FAIL,
          error: e.message
        }
      }
    }
  }
}