import { Controller, Body, BadRequestException, Put, HttpCode, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { EditQuestionUseCase } from "@/domain/forum/application/useCases/editQuestion";

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    attachments: z.array(z.uuid()),
});

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;


@Controller('/questions/:id')
export class EditQuestionController {

    constructor(private  editQuestion: EditQuestionUseCase) {}
    
    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string,
    ) {
        const { content, title, attachments } = body;
        const { sub: userId } = user;

        const result = await this.editQuestion.execute({
            title,
            content,
            questionId,
            authorId: userId,
            attachmentsIds: attachments,
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
