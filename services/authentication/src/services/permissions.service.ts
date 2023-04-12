import { service } from "@loopback/core";
import { repository } from "@loopback/repository";
import { UserLevelPermissionRepository } from "@sourceloop/authentication-service";
import { UserService } from "./user.service";
import { Permissions } from "../enum";
import { HttpErrors } from "@loopback/rest";
import { v4 } from "uuid";
import { PERMISSION } from "../constants";


export class PermissionsServie {

    constructor(
        @repository(UserLevelPermissionRepository)
        private readonly userLevelPerimissionRepo: UserLevelPermissionRepository,
        @service(UserService)
        private readonly userService: UserService
    ){}

    async addPermissionToUser(userId: string, permission: string) {
        this.checkPermissionString(permission);
        const userTenant = await this.userService.getUserTenetDetails(userId);

        const currentPermissions = await this.userLevelPerimissionRepo.find({
            where: {userTenantId: userTenant.id, permission},
          });
          if (currentPermissions.length > 0) {
            currentPermissions[0].allowed = true;
            const value = await this.userLevelPerimissionRepo.update(currentPermissions[0]);
            return value;
        } else {
            const value = await this.userLevelPerimissionRepo.create({
              id: v4(),
              userTenantId: userTenant.id,
              permission,
              allowed: true,
            });
            return value
          }
    }
    async removePermissionFromUser(userId: string, permission: string) {
        this.checkPermissionString(permission);
        const userTenant = await this.userService.getUserTenetDetails(userId);

        const currentPermissions = await this.userLevelPerimissionRepo.find({
            where: {userTenantId: userTenant.id, permission},
          });
          if (currentPermissions.length > 0) {
            currentPermissions[0].allowed = false;
            const value = await this.userLevelPerimissionRepo.update(currentPermissions[0]);
            return value;
          } else {
            throw HttpErrors.NotFound(PERMISSION.ERROR.PERMISSION_NOT_FOUND);
          }
    }

    checkPermissionString(permission: string) {
        if (!Object.values<string>(Permissions).includes(permission)) {
          throw HttpErrors.BadRequest(PERMISSION.ERROR.INVALID_PERMISSION_STRING);
        }
      }
}