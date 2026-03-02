import { Controller, Post, Body, UseGuards, BadRequestException, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/useCases/commentOnAnswer";

const commentOnAnswerBodySchema = z.object({
    content: z.string()
});

export type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;


@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {

    constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}
    
    @Post()
    async handle(
        @Body(new ZodValidationPipe(commentOnAnswerBodySchema)) body: CommentOnAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string,
    ) {
        const { content } = body;
        const { sub: userId } = user;

        const result = await this.commentOnAnswer.execute({
            content,
            authorId: userId,
            answerId,
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
