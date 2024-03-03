import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';

export interface UpdateThingUsecaseModel {
  message: string;
  data?: ThingUsecaseModel,
  error?: string;
}