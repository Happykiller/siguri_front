export interface CreateThingUsecaseDto {
  label: string;
  description?: string;
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
  user_id: string;
  chest_id: string;
  chest_secret: string;
}