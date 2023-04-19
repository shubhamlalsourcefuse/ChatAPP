import {RequestBodyObject, SchemaObject} from '@loopback/openapi-v3';


export const CHAT_SEND_MESSAGE_REQ_BODY: RequestBodyObject = {
  description: "",
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Chat Message Request',
        properties: {
          subject: {type: "string", required: ['no']},
          body: {type: "string"},
          toUserId: {type: "string"},
          channelId: {type: "string"},
          channelType: {type: "string"},
        }
      }
    }
  }
}

export const CHAT_MESSAGE_RECIPIT_WHERE: SchemaObject = {
  type: 'object',
  title: 'Chat Message Recipit',
  properties: {
    id: {type: 'string'},
    channelId: {type: 'string'},
    recipientId: {type: 'string'},
    messageId: {type: 'string'},
    isRead: {type: 'boolean'},
  }
}

export const CHAT_RECIPIT_MESSAGE_REQ_BODY: RequestBodyObject = {
  description: "",
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Chat Message Request',
        properties: CHAT_MESSAGE_RECIPIT_WHERE.properties
      }
    }
  }
};


