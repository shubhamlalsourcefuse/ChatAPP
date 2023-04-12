// Uncomment these imports to begin using these cool features!

import { service } from "@loopback/core";
import {getModelSchemaRef, post, requestBody} from '@loopback/rest'
import { AuthClientService } from "../services/auth-client.service";
import { CONTENT_TYPE } from "@sourceloop/core";
import { AuthClient } from "@sourceloop/authentication-service";
import { authorize } from "loopback4-authorization";

// import {inject} from '@loopback/core';


export class AuthClientController {
  constructor(
    @service(AuthClientService)
    private readonly authClientService: AuthClientService,
  ) {}

  @authorize({permissions:['*']})
  @post('/auth-client')
  async createAuthClient(@requestBody({
    content: {
      [CONTENT_TYPE.JSON]:{
        schema: getModelSchemaRef(AuthClient)
      }
    }
  })
  requestData:AuthClient
  ){
    const authClient =  await this.authClientService.create(requestData,{});
    return authClient;
  }
}
