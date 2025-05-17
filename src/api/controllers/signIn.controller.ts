import { RequestApi } from "api/apiClients/request";
import { apiConfig } from "config/api-config";
import { IRequestOptions, IResponse } from "types/api.types";
import { ILoginRequest, ISignInResponse } from "types/signIn.type";

export class SignInController {
  constructor(private request = new RequestApi()) {}

  async signIn(body: ILoginRequest): Promise<IResponse<ISignInResponse>> {
    const options: IRequestOptions = {
      url: apiConfig.ENDPOINTS.LOGIN,
      method: "post",
      data: body,
      headers: {
        "content-type": "application/json"
      },
    };

    return await this.request.send<ISignInResponse>(options);
  }
}
