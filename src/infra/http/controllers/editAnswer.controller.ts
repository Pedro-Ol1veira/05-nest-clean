import { Controller, Body, BadRequestException, Put, HttpCode, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { EditAnswerUseCase } from "@/domain/forum/application/useCases/editAnswer";

const editAnswerBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.uuid()).default([])
});

export type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;


@Controller('/answers/:id')
export class EditAnswerController {

    constructor(private  editAnswer: EditAnswerUseCase) {}
    
    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string,
    ) {
        const { content, attachments } = body;
        const { sub: userId } = user;

        const result = await this.editAnswer.execute({
            content,
            authorId: userId,
            attachmentsIds: attachments,
            answerId
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
