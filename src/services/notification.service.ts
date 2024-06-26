import { Inject, Injectable } from "@nestjs/common";
import { History } from "src/modules/history/entities/history.entity";
import { HistoryGateway } from "src/modules/history/hsitory.gateway";

@Injectable()
export class NotificationService {
    constructor(
        @Inject(HistoryGateway)
        private readonly historyGateway: HistoryGateway,
    ) {}
    sendNotification(userId: number, history: History): void {
        this.historyGateway.sendNotificationToUser(userId, history);
    }

}