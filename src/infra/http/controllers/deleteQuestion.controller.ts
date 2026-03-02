import { Controller, BadRequestException, HttpCode, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionUseCase } from "@/domain/forum/application/useCases/deleteQuestion";



@Controller('/questions/:id')
export class DeleteQuestionController {

    constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string,
    ) {
        const { sub: userId } = user;

        const result = await this.deleteQuestion.execute({
            questionId,
            authorId: userId
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
