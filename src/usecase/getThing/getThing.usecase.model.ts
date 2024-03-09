import ThingUsecaseModel from '@usecase/model/thing.usecase.model';

export default interface GetThingUsecaseModel {
  message: string;
  data?: ThingUsecaseModel,
  error?: string;
}