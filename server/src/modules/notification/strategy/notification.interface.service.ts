export interface NotificationStrategy {
    sendNotification(recipient: string, message: string): Promise<void>;
}
