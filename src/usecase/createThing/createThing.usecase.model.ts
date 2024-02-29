import { ThingUsecaseModel } from '../model/thing.usecase.model';

export interface CreateThingUsecaseModel {
  message: string;
  data?: ThingUsecaseModel,
  error?: string;
}