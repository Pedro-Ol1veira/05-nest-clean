import { Controller, Post, Body, UseGuards, BadRequestException, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { AnswerQuestionUseCase } from "@/domain/forum/application/useCases/answerQuestion";

const answerQuestionBodySchema = z.object({
    content: z.string()
});

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;


@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {

    constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}
    
    @Post()
    async handle(
        @Body(new ZodValidationPipe(answerQuestionBodySchema)) body: AnswerQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string,
    ) {
        const { content } = body;
        const { sub: userId } = user;

        const result = await this.answerQuestion.execute({
            content,
            authorId: userId,
            questionId,
            attachmentsIds: []
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
