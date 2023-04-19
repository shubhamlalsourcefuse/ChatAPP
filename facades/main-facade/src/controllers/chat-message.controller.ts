// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {del, get, param, patch, post, requestBody} from '@loopback/openapi-v3';
import {Filter, Where} from '@loopback/repository';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ChatMessage, ChatMessageRecipit, ChatMessageRepo} from '../interfaces';
import {CHAT_MESSAGE_RECIPIT_WHERE, CHAT_SEND_MESSAGE_REQ_BODY} from '../schema/chat.rest';

// import {inject} from '@loopback/core';


export class ChatMessageController {
  constructor(
    @inject('services.ChatMessage') private chatMessageService: ChatMessageRepo
  ) { }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post('/messages')
  async sendMessage(
    @param.header.string('Authorization') token: string,
    @requestBody(CHAT_SEND_MESSAGE_REQ_BODY) body: ChatMessage
  ) {
    const message = await this.chatMessageService.sendMessage(token, body);
    console.log('message', message)
    const messageRecipit = await this.chatMessageService.sendMessageRecipients(
      token,
      {
        channelId: message.channelId,
        recipientId: message.toUserId,
        messageId: message.id as string
      });
    return {message, messageRecipit}
  }


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/messages')
  async getMessage(
    @param.query.string('channelId') channelId: string,
    @param.header.string('Authorization') token: string
  ) {
    const filter: Filter = {
      where: {channelId},
    }
    const messages = await this.chatMessageService.getMessage(token, filter);
    return messages;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @del('/messages/{id}')
  async deleteMessage(
    @param.path.string('id') id: string,
    @param.header.string('Authorization') token: string
  ) {
    const deletedMessage = await this.chatMessageService.deleteMessage(token, id)
    return deletedMessage;
  }


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch('/messages/recipit/{id}')
  async updateRecipit(
    @param.header.string('Authorization') token: string,
    @param.path.string('id') id: string,
    @requestBody() body: Partial<ChatMessageRecipit>,
    @param.query.object('where', CHAT_MESSAGE_RECIPIT_WHERE)
    where?: Where<ChatMessageRecipit>,
  ) {

    const updatedRecipit = this.chatMessageService.updateMessageRecipients(token, id, body, where)
  }

}
