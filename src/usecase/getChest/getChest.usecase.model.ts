import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';

export interface GetChestUsecaseModel {
  message: string;
  data?: ChestUsecaseModel,
  error?: string;
}