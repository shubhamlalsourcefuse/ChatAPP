// Uncomment these imports to begin using these cool features!

import {inject} from "@loopback/context";
import {post, requestBody} from "@loopback/openapi-v3";
import {authorize} from "loopback4-authorization";
import {AuthRepository, TokenSuccess, UserLogin, UserLoginSuccess} from "../interfaces";

// import {inject} from '@loopback/core';


export class AuthController {
  constructor(
    @inject('services.AuthService', {optional: true}) protected authService: AuthRepository
  ) { }

  @authorize({permissions: ['*']})
  @post('/login')
  async login(@requestBody() data: UserLogin): Promise<TokenSuccess> {
    const result: UserLoginSuccess = await this.authService.login(data);
    const token = await this.authService.getToken({
      code: result.code,
      clientId: data.client_id
    });
    return token;
  }
}
