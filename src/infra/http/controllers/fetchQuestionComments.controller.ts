import { Controller, Get, Query, BadRequestException, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/useCases/fetchQuestionComments";
import { CommentPresenter } from "../presenters/commentPresenter";

const pageQueryParamSchema = z.string().optional().transform(Number).pipe(
    z.number().min(1)
).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {

    constructor(private readonly fetchQuestionComments: FetchQuestionCommentsUseCase) {}
    
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
        
        const { questionComments }= result.value;
        
        return { comments: questionComments.map(CommentPresenter.toHTTP) };
    }
}
