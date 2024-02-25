export interface GeneratePasswordUsecaseModel {
  message: string;
  data?: {
    password: string;
  },
  error?: string;
}