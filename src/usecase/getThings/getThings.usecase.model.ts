import ThingUsecaseModel from '@usecase/model/thing.usecase.model';

export default interface GetThingsUsecaseModel {
  message: string;
  data?: ThingUsecaseModel[],
  error?: string;
}