import { IResponseFields } from "./api.types";

// Интерфейс для данных логина (запрос)
export interface ILoginRequest {
  username: string;
  password: string;
}

// Интерфейс для полезных данных ответа
export interface ISignInData {
  IsSuccess: boolean;
  ErrorMessage: string;
}

// Интерфейс для полного ответа API
export interface ISignInResponse extends IResponseFields {
  SignInResult: ISignInData;
}
