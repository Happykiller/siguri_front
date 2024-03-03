import { CODES } from '@src/common/codes';
import { Inversify } from '@src/common/inversify';
import { UpdateThingUsecaseDto } from '@usecase/updateThing/updateThing.usecase.dto';
import { UpdateThingUsecaseModel } from '@usecase/updateThing/updateThing.usecase.model';

export class UpdateThingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: UpdateThingUsecaseDto): Promise<UpdateThingUsecaseModel>  {
    try {
      const newDto:any = {
        ... dto,
        thing_id: dto.id
      };
      delete newDto.id;
      delete newDto.type;
      delete newDto.author;
      delete newDto.chest;

      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'update_thing',
          variables: newDto,
          query: `mutation update_thing(
            $thing_id: String!, 
            $chest_secret: String!
            $label: String!,
            $description: String!,
            $code: CreateThingCodeResolverDto, 
            $note: CreateThingNoteResolverDto, 
            $cb: CreateThingCbResolverDto, 
            $credential: CreateThingCredentialResolverDto
          ) {
            update_thing (
              dto: {
                thing_id: $thing_id
                chest_secret: $chest_secret
                label: $label
                description: $description
                code: $code 
                note: $note
                cb: $cb
                credential: $credential
              }
            ) 
            {
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
        data: response.data.update_thing
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