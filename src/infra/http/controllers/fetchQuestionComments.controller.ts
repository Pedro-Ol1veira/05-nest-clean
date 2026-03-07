import { Controller, Get, Query, BadRequestException, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/useCases/fetchQuestionComments";
import { CommentWithAuthorPresenter } from "../presenters/commentWithAuthorPresenter";

const pageQueryParamSchema = z.string().optional().transform(Number).pipe(
    z.number().min(1)
).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {

    constructor(private  fetchQuestionComments: FetchQuestionCommentsUseCase) {}
    
    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string,
    ){
        const result = await this.fetchQuestionComments.execute({
            page,
            questionId
        });

        if(result.isLeft()) throw new BadRequestException();
        
        const { comments }= result.value;
        
        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
    }
}
