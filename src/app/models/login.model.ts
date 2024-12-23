export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponseModel {
  status: boolean;
  data: {
    access_token: string;
  }
}
