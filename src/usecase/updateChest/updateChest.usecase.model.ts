import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';

export default interface UpdateChestUsecaseModel {
  message: string;
  data?: ChestUsecaseModel,
  error?: string;
}