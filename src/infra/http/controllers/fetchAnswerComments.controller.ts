import { Controller, Get, Query, BadRequestException, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/useCases/fetchAnswerComments";
import { CommentWithAuthorPresenter } from "../presenters/commentWithAuthorPresenter";

const pageQueryParamSchema = z.string().optional().transform(Number).pipe(
    z.number().min(1)
).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {

    constructor(private  fetchAnswerComments: FetchAnswerCommentsUseCase) {}
    
    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('answerId') answerId: string,
    ){
        const result = await this.fetchAnswerComments.execute({
            page,
            answerId
        });

        if(result.isLeft()) throw new BadRequestException();
        
        const { comments }= result.value;
        
        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
    }
}
