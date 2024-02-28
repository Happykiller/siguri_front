import { UserUsecaseModel } from '../model/user.usecase.model';

export interface ChestUsecaseModel {
  id: string;
  label: string;
  description?: string;
  author_id: string;
  author: UserUsecaseModel;
  members: {
    user_id: string;
    user: UserUsecaseModel;
  }[]
}