import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';

export interface GetChestsUsecaseModel {
  message: string;
  data?: ChestUsecaseModel[],
  error?: string;
}