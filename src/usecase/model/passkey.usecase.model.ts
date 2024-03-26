export interface PasskeyUsecaseModel {
  id: string;
  label: string;
  user_id: string;
  user_code: string;
  display_name: string;
  challenge_buffer: string;
}