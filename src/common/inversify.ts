import config from '@src/config/';
import AjaxService from '@service/ajax/ajax.service';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import { AjaxServiceReal } from '@service/ajax/ajax.service.real';
import { AjaxServiceFake } from '@service/ajax/ajax.service.fake';

export class Inversify {
  authUsecase: AuthUsecase;
  ajaxService: AjaxService;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);

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