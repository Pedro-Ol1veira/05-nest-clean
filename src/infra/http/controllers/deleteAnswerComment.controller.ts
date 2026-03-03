import { Controller, BadRequestException, Param, Delete, HttpCode } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/useCases/deleteAnswerComment";

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {

    constructor(private  deleteAnswerComment: DeleteAnswerCommentUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerCommentId: string,
    ) {
        const { sub: userId } = user;

        const result = await this.deleteAnswerComment.execute({
            authorId: userId,
            answerCommentId
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
