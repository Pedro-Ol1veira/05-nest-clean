import { Controller, BadRequestException, HttpCode, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerUseCase } from "@/domain/forum/application/useCases/deleteAnswer";



@Controller('/answers/:id')
export class DeleteAnswerController {

    constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}
    
    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string,
    ) {
        const { sub: userId } = user;

        const result = await this.deleteAnswer.execute({
            answerId,
            authorId: userId,
        });

        if(result.isLeft()) throw new BadRequestException();
    }
}
