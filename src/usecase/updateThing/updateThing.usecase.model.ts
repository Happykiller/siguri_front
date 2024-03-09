import ThingUsecaseModel from '@usecase/model/thing.usecase.model';

export default interface UpdateThingUsecaseModel {
  message: string;
  data?: ThingUsecaseModel,
  error?: string;
}