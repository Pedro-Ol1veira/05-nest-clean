import { Controller, Get, BadRequestException, Param, Patch, HttpCode } from "@nestjs/common";
import { ReadNotificationUseCase } from "@/domain/notification/application/useCases/readNotification";
import { QuestionDetailsPresenter } from "../presenters/questionDetailsPresenter";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {

    constructor(private  readNotification: ReadNotificationUseCase) {}
    
    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('notificationId') notificationId: string
    ){
        const result = await this.readNotification.execute({
            notificationId,
            recipientId: user.sub,
        });

        if(result.isLeft()) throw new BadRequestException();
           
    }
}
