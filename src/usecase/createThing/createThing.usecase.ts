import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { CreateThingUsecaseDto } from '@usecase/createThing/createThing.usecase.dto';
import { CreateThingUsecaseModel } from '@usecase/createThing/createThing.usecase.model';

export class CreateThingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: CreateThingUsecaseDto): Promise<CreateThingUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'create_thing',
          variables: dto,
          query: `mutation create_thing(
            $label: String!,
            $description: String!, 
            $chest_id: String!, 
            $chest_secret: String!, 
            $type: String!,
            $code: CreateThingCodeResolverDto, 
            $note: CreateThingNoteResolverDto, 
            $cb: CreateThingCbResolverDto, 
            $credential: CreateThingCredentialResolverDto
          ) {
            create_thing (
              dto: {
                label: $label
                description: $description
                chest_id: $chest_id
                chest_secret: $chest_secret
                type: $type
                code: $code 
                note: $note
                cb: $cb
                credential: $credential
              }
            ) {
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
        data: response.data.create_thing
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.CREATE_THING_FAIL,
          error: e.message
        }
      }
    }
  }
}