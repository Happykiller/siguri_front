import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';

export interface GetThingUsecaseModel {
  message: string;
  data?: ThingUsecaseModel,
  error?: string;
}