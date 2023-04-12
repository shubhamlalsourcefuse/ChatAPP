// Uncomment these imports to begin using these cool features!

import { repository } from "@loopback/repository";
import { getModelSchemaRef, post, requestBody } from "@loopback/openapi-v3";
import { CustomTenantRepository } from "../repositories";
import { CONTENT_TYPE } from "@sourceloop/core";
import { Tenant, TenantConfig } from "@sourceloop/authentication-service";
import { genericExclusions } from "../helper";
import { authorize } from "loopback4-authorization";
import { STRATEGY, authenticate } from "loopback4-authentication";

// import {inject} from '@loopback/core';


export class CustomTenantController {
  constructor(
    @repository(CustomTenantRepository)
    private readonly customTenantRepo: CustomTenantRepository
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:['*']})
  @post('/tenant')
  async createTenant(
    @requestBody({
      content:{
        [CONTENT_TYPE.JSON]:{
          schema: getModelSchemaRef(Tenant,{
            exclude: genericExclusions<Tenant>()
          })
        },
      }
    }) requestedData: Tenant
  ): Promise<Tenant>{
    const value = await this.customTenantRepo.createNewTenant(requestedData);
    return value;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:['*']})
  @post('/tenant-config')
  async createTenantConfig(
    @requestBody({
      content:{
        [CONTENT_TYPE.JSON]:{
          schema: getModelSchemaRef(TenantConfig,{
            exclude: genericExclusions<TenantConfig>()
          })
        }
      }
    }) requestedData: TenantConfig
  ): Promise<TenantConfig>{
    const value = await this.customTenantRepo.createNewTenantConfig(requestedData);
    return value;
  }
}
