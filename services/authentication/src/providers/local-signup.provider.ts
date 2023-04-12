import {Provider, service} from '@loopback/core';
import {UserSignupFn} from '@sourceloop/authentication-service';
import {UserModel} from '../models/user.model';
import { UserService } from "../services/user.service";

export class LocalSignupProvider
  implements Provider<UserSignupFn<UserModel, UserModel>>
{
  constructor(
    @service(UserService)
    private readonly userService: UserService,
  ) {}

  value(): UserSignupFn<UserModel, UserModel> {
    return async (model, token) => this.userService.createUser(model, {});
  }
}