import { Controller, BadRequestException, HttpCode, Param, Patch } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ChoseQuestionBestAnswerUseCase } from "@/domain/forum/application/useCases/choseQuestionBestAnswer";


@Controller('/answers/:answerId/chose-as-best')
export class ChoseQuestionBestAnswerController {

    constructor(private readonly choseQuestionBestAnswer: ChoseQuestionBestAnswerUseCase) {}
    
    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string,
    ) {
        const { sub: userId } = user;

        const result = await this.choseQuestionBestAnswer.execute({
            authorId: userId,
            answerId,
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
