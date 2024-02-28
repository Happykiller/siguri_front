import { UserUsecaseModel } from './user.usecase.model';

export interface ThingUsecaseModel {
  id: string;
  label: string;
  description?: string;
  author_id: string;
  author: UserUsecaseModel;
  chest: {
    id: string;
    label: string;
  }
  type: string;
}