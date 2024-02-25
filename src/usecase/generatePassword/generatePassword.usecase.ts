import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { GeneratePasswordUsecaseDto } from './dto/generatePassword.usecase.dto';
import { GeneratePasswordUsecaseModel } from './model/generatePassword.usecase.model';

export class GeneratePasswordUsecase {

  SessionInfo:any;

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GeneratePasswordUsecaseDto): Promise<GeneratePasswordUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'generatePassword',
          variables: dto,
          query: `query generatePassword($length: Int!, $specials: Boolean!) {
            generatePassword (
              dto: {
                length: $length
                specials: $specials
              }
            ) {
              password
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.generatePassword
      }
    } catch (e: any) {
      return {
        message: CODES.FAIL,
        error: e.message
      }
    }
  }
}