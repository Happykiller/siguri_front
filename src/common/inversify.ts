import config from '@src/config/';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import LoggerService from '@service/logger/logger.service';
import GraphqlService from '@service/graphql/graphql.service';
import { SystemInfoUsecase } from '@usecase/system/systemInfo.usecase';
import { LoggerServiceReal } from '@service/logger/logger.service.real';
import { GraphqlServiceFake } from '@service/graphql/graphql.service.fake';
import { GraphqlServiceFetch } from '@service/graphql/graphql.service.fetch';
import { SessionInfoUsecase } from '@usecase/sessionInfo/systemInfo.usecase';
import { GeneratePasswordUsecase } from '@src/usecase/generatePassword/generatePassword.usecase';

export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  generatePasswordUsecase: GeneratePasswordUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
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