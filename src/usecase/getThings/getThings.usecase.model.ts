import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';

export interface GetThingsUsecaseModel {
  message: string;
  data?: ThingUsecaseModel[],
  error?: string;
}