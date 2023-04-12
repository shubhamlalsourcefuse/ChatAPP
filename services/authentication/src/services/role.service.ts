import { BindingScope, injectable } from "@loopback/context";
import { AnyObject, repository } from "@loopback/repository";
import { Role, RoleRepository } from "@sourceloop/authentication-service";
import { v4 } from "uuid";

@injectable({scope:BindingScope.TRANSIENT})
export class RoleService {
    constructor(@repository(RoleRepository)
    private readonly roleRepository : RoleRepository){}

    async createRole(role: Role, options:AnyObject){
        role.id = v4();
        const savedRole = await this.roleRepository.create(role);
        return new Role({createdOn: savedRole.createdOn, name: savedRole.name});
    }

}