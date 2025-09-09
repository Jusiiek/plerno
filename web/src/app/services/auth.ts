import { Injectable } from '@angular/core';
import { ApiService } from "../utils/request";
import { REQUEST_METHODS } from "../common/request_methods";
import { ActiveUserModel } from "../interfaces/active_user";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_API = environment.USER_API;

  constructor(private api: ApiService) {}

  async login(email: string, password: string) {
    return await this.api.request<ActiveUserModel>({
      url: `${this.USER_API}/auth/jwt/login`,
      method: REQUEST_METHODS.POST,
      body: { email, password },
      skipRedirect: true,
    });
  }

  async register(email: string, password: string) {
    return await this.api.request<ActiveUserModel>({
      url: `${this.USER_API}/auth/jwt/register`,
      method: REQUEST_METHODS.POST,
      body: { email, password },
      skipRedirect: true,
    });
  }

  async logout() {
    return await this.api.request({
      url: `${this.USER_API}/auth/jwt/logout`,
      method: REQUEST_METHODS.POST
    });
  }
}
