import { UserUsecaseModel } from './user.usecase.model';

export default interface ThingUsecaseModel {
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
  cb?: {
    label: string;
    number: string;
    expiration_date: string;
    code: string;
    crypto: string;
  };
  code?: {
    code: string;
  };
  note?: {
    note: string;
  };
  credential?: {
    id: string;
    password: string;
    address?: string;
  };
}