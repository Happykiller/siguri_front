import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';

export interface CreateChestUsecaseModel {
  message: string;
  data?: ChestUsecaseModel,
  error?: string;
}