import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ChatServiceDataSource} from '../datasources';
import {ChatMessageRepo} from '../interfaces';

export interface ChatMessage {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class ChatMessageProvider implements Provider<ChatMessageRepo> {
  constructor(
    // ChatService must match the name property in the datasource json file
    @inject('datasources.ChatService')
    protected dataSource: ChatServiceDataSource = new ChatServiceDataSource(),
  ) { }

  value(): Promise<ChatMessageRepo> {
    return getService(this.dataSource);
  }
}
