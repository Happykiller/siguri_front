import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import CreatePasskeyUsecaseDto from '@usecase/createPasskey/createPasskey.usecase.dto';
import { CreatePasskeyUsecaseModel } from '@usecase/createPasskey/createPasskey.usecase.model';

export class CreatePasskeyUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: CreatePasskeyUsecaseDto): Promise<CreatePasskeyUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'create_passkey',
          variables: dto,
          query: `mutation create_passkey(
            $display_name: String!, 
            $challenge_buffer: String!, 
            $challenge: String!
          ) {
            create_passkey (
              dto: {
                display_name: $display_name
                challenge_buffer: $challenge_buffer
                challenge: $challenge
              }
            )
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
      return {
        message: CODES.CREATE_CHEST_FAIL,
        error: e.message
      }
    }
  }
}