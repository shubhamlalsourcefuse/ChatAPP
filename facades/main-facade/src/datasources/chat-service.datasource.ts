import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import ChatRestConfig from "../config/chat-service.json";

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ChatServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'ChatService';
  static readonly defaultConfig = ChatRestConfig;

  constructor(
    @inject('datasources.config.ChatService', {optional: true})
    dsConfig: object = ChatRestConfig,
  ) {
    dsConfig = Object.assign({},ChatRestConfig,{options:{baseUrl: process.env.CHAT_SERVICE_BASE_URL}})
    super(dsConfig);
  }
}
