import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import AuthRestServiceConfig from "../config/auth-service.json"

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'AuthService';
  static readonly defaultConfig = AuthRestServiceConfig;

  constructor(
    @inject('datasources.config.AuthService', {optional: true})
    dsConfig: object = AuthRestServiceConfig,
  ) {

    dsConfig = Object.assign({},AuthRestServiceConfig,{
      options: {baseUrl: process.env.AUTH_SERVICE_BASE_URL}
    })
    super(dsConfig);
  }
}
