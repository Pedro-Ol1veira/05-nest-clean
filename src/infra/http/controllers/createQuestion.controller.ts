import { Controller, Post, Body, UseGuards, BadRequestException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { CreateQuestionUseCase } from "@/domain/forum/application/useCases/createQuestion";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    attachments: z.array(z.uuid())
});

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;


@Controller('/questions')
export class CreateQuestionController {

    constructor(private  createQuestion: CreateQuestionUseCase) {}
    
    @Post()
    async handle(
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { content, title, attachments } = body;
        const { sub: userId } = user;

        const result = await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: attachments
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
