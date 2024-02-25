import config from '@src/config/';
import AjaxService from '@service/ajax/ajax.service';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import LoggerService from '@service/logger/logger.service';
import { AjaxServiceReal } from '@service/ajax/ajax.service.real';
import { AjaxServiceFake } from '@service/ajax/ajax.service.fake';
import { SystemInfoUsecase } from '@usecase/system/systemInfo.usecase';
import { LoggerServiceReal } from '@service/logger/logger.service.real';
import { SessionInfoUsecase } from '@usecase/sessionInfo/systemInfo.usecase';

export class Inversify {
  authUsecase: AuthUsecase;
  ajaxService: AjaxService;
  loggerService: LoggerService;
  sessionInfo: SessionInfoUsecase;
  systemInfoUsecase: SystemInfoUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);

    // Services
    if (config.mode === 'prod') {
      this.ajaxService = new AjaxServiceReal(this);
    } else {
      this.ajaxService = new AjaxServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;