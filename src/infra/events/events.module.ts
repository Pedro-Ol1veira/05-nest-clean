import { OnAnswerCreated } from "@/domain/notification/application/subscribers/onAnswerCreated";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/onQuestionBestAnswerChosen";
import { SendNotificationUseCase } from "@/domain/notification/application/useCases/sendNotification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [
        OnAnswerCreated,
        OnQuestionBestAnswerChosen,
        SendNotificationUseCase
    ],
})
export class EventsModule {

}