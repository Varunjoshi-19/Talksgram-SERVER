// interfaces/index.ts
export interface Config {
  port: number | string;
  mongoUrl: string;
}


export interface notificationPayload {
  senderUserID: string,
  receiverUserID: string,
  receiverUsername: string
}