import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {AuthServiceDataSource} from '../datasources';

import {AuthRepository} from '../interfaces';


export class AuthServiceProvider implements Provider<AuthRepository> {
  constructor(
    // AuthService must match the name property in the datasource json file
    @inject('datasources.AuthService')
    protected dataSource: AuthServiceDataSource = new AuthServiceDataSource(),
  ) { }

  value(): Promise<AuthRepository> {
    return getService(this.dataSource);
  }
}
