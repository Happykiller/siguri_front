export default interface UpdateThingUsecaseDto {
  id: string;
  label: string;
  description?: string;
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
  chest_secret: string;
}