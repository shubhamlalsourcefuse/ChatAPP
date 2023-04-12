import {BindingScope, injectable} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from "@loopback/rest";
import {User, UserCredentials, UserTenant} from '@sourceloop/authentication-service';
import {AuthClientRepository, RoleRepository, UserRepository, UserTenantRepository} from "@sourceloop/authentication-service/dist/repositories";
import {AuthenticateErrorKeys, UserStatus} from '@sourceloop/core';
import bcrypt from 'bcrypt';
import {COMMON, USER} from '../constants';
import {UserModel} from "../models/user.model";
const saltRounds = 10;

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {

  constructor(
    @repository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @repository(UserTenantRepository)
    private readonly utRepository: UserTenantRepository,
    @repository(AuthClientRepository)
    private readonly authClientsRepository: AuthClientRepository
  ) { }

  async createUser(user: UserModel, options: AnyObject) {
    this.validateUserCreation(user, options);

    const authClient = await this.authClientsRepository.findOne({
      where: {
        clientId: user.clientId,
      },
    });

    if (!authClient) {
      throw new HttpErrors.BadRequest(USER.ERROR.INVALID_CLIENT);
    }

    const userExists = await this.userRepository.findOne({
      where: {
        or: [{username: user.username}, {email: user.email}],
      },
      fields: {
        id: true,
      },
    });

    if (userExists) {
      const userTenantExists = await this.utRepository.findOne({
        where: {
          userId: userExists.id,
          tenantId: user.tenantId,
        },
      });

      if (userTenantExists) {
        throw new HttpErrors.BadRequest(USER.ERROR.ALREADY_EXISTS);
      } else {
        const userTenant: UserTenant = await this.createUserTenantData(
          user,
          UserStatus.ACTIVE,
          userExists?.id,
          options,
        );
        return new UserModel({
          roleId: userTenant.roleId,
          status: userTenant.status,
          tenantId: userTenant.tenantId,
          userTenantId: userTenant.id,
        });
      }
    }

    const username = user.username;
    user.username = username.toLowerCase();
    //Override default tenant id
    const userSaved = await this.userRepository.createWithoutPassword(
      new User({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        defaultTenantId: user.tenantId,
        authClientIds: `{${authClient?.id}}`,
      }),
      options,
    );

    const userTenantData = await this.createUserTenantData(
      user,
      UserStatus.ACTIVE,
      userSaved?.id,
      options,
    );

    await this.setPassword(user.email, user.password);

    return new UserModel({
      roleId: userTenantData.roleId,
      status: userTenantData.status,
      tenantId: userTenantData.tenantId,
      userTenantId: userTenantData.id,
    });

  }

  validateUserCreation(userData: UserModel, options?: AnyObject) {
    // Check for valid email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (userData.email && !emailRegex.test(userData.email)) {
      throw new HttpErrors.BadRequest(COMMON.ERROR.INVALID_EMAIL);
    }

    // Check for allowed domains
    const allowedDomains = (process.env.AUTO_SIGNUP_DOMAINS ?? '').split(',');
    const emailDomain = userData.email.split('@')[1];
    if (!(emailDomain && allowedDomains.length > 0)) {
      throw new HttpErrors.BadRequest(
        COMMON.ERROR.CORS,
      );
    }
    if (!allowedDomains.includes(emailDomain) && options) {
      options.authProvider = 'internal';
      return;
    }
    const e164RegEx = /^\+?[1-9]\d{1,14}$/;

    if (userData.phone && !e164RegEx.test(userData.phone)) {
      throw new HttpErrors.BadRequest(COMMON.ERROR.INVALID_PHONE);
    }
  }

  async createUserTenantData(
    userData: UserModel,
    userStatus: UserStatus,
    userId?: string,
    options?: AnyObject,
  ) {
    return this.utRepository.create(
      {
        roleId: userData.roleId,
        status: userStatus,
        tenantId: userData.tenantId,
        userId,
      },
      options,
    );
  }


  async setPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {email}});
    let creds;
    try {
      creds = user && (await this.userRepository.credentials(user.id).get());
    } catch (e) {
      //do nothing
    }
    if (!user || user.deleted) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (creds) {
      throw new HttpErrors.Unauthorized(USER.ERROR.USER_ALREADY_SIGNED);
    } else {
      // Do nothing
    }
    const password = await bcrypt.hash(newPassword, saltRounds);
    creds = new UserCredentials({
      authProvider: 'internal',
      password,
    });
    await this.userRepository.credentials(user.id).create(creds);
    return true;
  }

  async getUserTenetDetails(userId: string) {
    const user = await this.utRepository.find({
      where: {userId: userId}
    })
    if (!user.length) {
      throw HttpErrors.NotFound(USER.ERROR.INVALID_USER_ID);
    }
    return user[0];
  }
}
