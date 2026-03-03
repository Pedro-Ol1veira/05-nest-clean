import { Controller, Post, Body, UseGuards, BadRequestException, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/useCases/commentOnQuestion";

const commentOnQuestionBodySchema = z.object({
    content: z.string()
});

export type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;


@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {

    constructor(private  commentOnQuestion: CommentOnQuestionUseCase) {}
    
    @Post()
    async handle(
        @Body(new ZodValidationPipe(commentOnQuestionBodySchema)) body: CommentOnQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string,
    ) {
        const { content } = body;
        const { sub: userId } = user;

        const result = await this.commentOnQuestion.execute({
            content,
            authorId: userId,
            questionId,
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
