import { Model, property } from "@loopback/repository";
import { UserStatus } from "@sourceloop/core";


export class UserModel extends Model {

    @property({
        type: 'string',
        required: true,
      })
      roleId: string;
    
      @property({
        type: 'string',
        required: true,
      })
      username: string;
    
      @property({
        type: 'string',
        required: true,
      })
      email: string;
    
      @property({
        type: 'string',
        required: true,
      })
      phone: string;
    
      @property({
        type: 'string',
        required: true,
      })
      password: string;
    
      @property({
        type: 'string',
      })
      status?: UserStatus;
    
      @property({
        type: 'string',
        required: true,
      })
      firstName: string;
    
      @property({
        type: 'string',
      })
      lastName?: string;
    
      @property({
        type: 'string',
        required: true,
      })
      tenantId: string;
    
      @property({
        type: 'string',
        required: true,
      })
      userTenantId: string;
    
      @property({
        type: 'string',
        required: true,
      })
      clientId: string;
    
    
      constructor(data?: Partial<UserModel>) {
        super(data);
      }


}

export type UserModelWithRelations = UserModel;