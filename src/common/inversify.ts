import config from '@src/config/';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import LoggerService from '@service/logger/logger.service';
import GraphqlService from '@service/graphql/graphql.service';
import { GetChestUsecase } from '@usecase/getChest/getChest.usecase';
import { SystemInfoUsecase } from '@usecase/system/systemInfo.usecase';
import { GetChestsUsecase } from '@usecase/getChests/getChests.usecase';
import { LoggerServiceReal } from '@service/logger/logger.service.real';
import { GetThingsUsecase } from '@usecase/getThings/getThings.usecase';
import { GraphqlServiceFake } from '@service/graphql/graphql.service.fake';
import { GraphqlServiceFetch } from '@service/graphql/graphql.service.fetch';
import { SessionInfoUsecase } from '@usecase/sessionInfo/systemInfo.usecase';
import { CreateChestUsecase } from '@usecase/createChest/createChest.usecase';
import { CreateThingUsecase } from '@usecase/createThing/createThing.usecase';
import { GeneratePasswordUsecase } from '@usecase/generatePassword/generatePassword.usecase';

export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  getChestUsecase: GetChestUsecase;
  getChestsUsecase: GetChestsUsecase;
  getThingsUsecase: GetThingsUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  createChestUsecase: CreateChestUsecase;
  createThingUsecase: CreateThingUsecase;
  generatePasswordUsecase: GeneratePasswordUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.getChestUsecase = new GetChestUsecase(this);
    this.getThingsUsecase = new GetThingsUsecase(this);
    this.getChestsUsecase = new GetChestsUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.createThingUsecase= new CreateThingUsecase(this);
    this.createChestUsecase = new CreateChestUsecase(this);
    this.generatePasswordUsecase = new GeneratePasswordUsecase(this);

    // Services
    if (config.mode === 'prod') {
      this.graphqlService = new GraphqlServiceFetch(this);
    } else {
      this.graphqlService = new GraphqlServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;