// Uncomment these imports to begin using these cool features!

import { RoleService } from "../services/role.service";
import { getModelSchemaRef, post, requestBody } from "@loopback/openapi-v3";
import { Role } from "@sourceloop/authentication-service";
import { CONTENT_TYPE } from "@sourceloop/core";
import { genericExclusions } from "../helper";
import { authorize } from "loopback4-authorization";
import { service } from "@loopback/core";
import { STRATEGY, authenticate } from "loopback4-authentication";

// import {inject} from '@loopback/core';


export class RoleController {
  constructor(
    @service(RoleService)
    private readonly roleService: RoleService
    ) {
    }
    @authenticate(STRATEGY.BEARER)
    @authorize({permissions: ['*']})
    @post('/role-create')
    async createRole(@requestBody({
      content:{
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Role,
            {exclude: genericExclusions<Role>()
            })
        }
      }
    }) requestData: Role): Promise<Role> {
      const value = await this.roleService.createRole(requestData,{});
      return value;
    }

}

