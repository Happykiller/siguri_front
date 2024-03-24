import config from '@src/config/';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import LoggerService from '@service/logger/logger.service';
import GraphqlService from '@service/graphql/graphql.service';
import { GetThingUsecase } from '@usecase/getThing/getThing.usecase';
import { GetChestUsecase } from '@usecase/getChest/getChest.usecase';
import { SystemInfoUsecase } from '@usecase/system/systemInfo.usecase';
import { GetChestsUsecase } from '@usecase/getChests/getChests.usecase';
import { LoggerServiceReal } from '@service/logger/logger.service.real';
import { GetThingsUsecase } from '@usecase/getThings/getThings.usecase';
import { JoinChestUsecase } from '@usecase/joinChest/joinChest.usecase';
import { LeaveChestUsecase } from '@usecase/leaveChest/leaveChest.usecase';
import { GraphqlServiceFake } from '@service/graphql/graphql.service.fake';
import { GraphqlServiceFetch } from '@service/graphql/graphql.service.fetch';
import { SessionInfoUsecase } from '@usecase/sessionInfo/systemInfo.usecase';
import { CreateChestUsecase } from '@usecase/createChest/createChest.usecase';
import { CreateThingUsecase } from '@usecase/createThing/createThing.usecase';
import { UpdateThingUsecase } from '@usecase/updateThing/updateThing.usecase';
import { DeleteThingUsecase } from '@usecase/deleteThing/deleteThing.usecase';
import { UpdateChestUsecase } from '@usecase/updateChest/updateThing.usecase';
import { UpdPasswordUsecase } from '@usecase/updPassword/updPassword.usecase';
import { CreatePasskeyUsecase } from '@usecase/createPasskey/createPasskey.usecase';
import { GeneratePasswordUsecase } from '@usecase/generatePassword/generatePassword.usecase';

export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  getThingUsecase: GetThingUsecase;
  getChestUsecase: GetChestUsecase;
  getChestsUsecase: GetChestsUsecase;
  getThingsUsecase: GetThingsUsecase;
  joinChestUsecase: JoinChestUsecase;
  leaveChestUsecase: LeaveChestUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  createChestUsecase: CreateChestUsecase;
  createThingUsecase: CreateThingUsecase;
  deleteThingUsecase: DeleteThingUsecase;
  updateThingUsecase: UpdateThingUsecase;
  updPasswordUsecase: UpdPasswordUsecase;
  updateChestUsecase: UpdateChestUsecase;
  createPasskeyUsecase: CreatePasskeyUsecase;
  generatePasswordUsecase: GeneratePasswordUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.getChestUsecase = new GetChestUsecase(this);
    this.getThingUsecase = new GetThingUsecase(this);
    this.getThingsUsecase = new GetThingsUsecase(this);
    this.getChestsUsecase = new GetChestsUsecase(this);
    this.joinChestUsecase = new JoinChestUsecase(this);
    this.leaveChestUsecase = new LeaveChestUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.createThingUsecase = new CreateThingUsecase(this);
    this.updateThingUsecase = new UpdateThingUsecase(this);
    this.createChestUsecase = new CreateChestUsecase(this);
    this.deleteThingUsecase = new DeleteThingUsecase(this);
    this.updPasswordUsecase = new UpdPasswordUsecase(this);
    this.updateChestUsecase = new UpdateChestUsecase(this);
    this.createPasskeyUsecase = new CreatePasskeyUsecase(this);
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