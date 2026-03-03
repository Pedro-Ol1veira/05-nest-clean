import { Controller, Get, Query, BadRequestException, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/useCases/fetchQuestionsAnswers";
import { QuestionPresenter } from "../presenters/questionPresenter";
import { AnswerPresenter } from "../presenters/answerPresenter";

const pageQueryParamSchema = z.string().optional().transform(Number).pipe(
    z.number().min(1)
).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {

    constructor(private  fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}
    
    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string,
    ){
        const result = await this.fetchQuestionAnswers.execute({
            page,
            questionId
        });

        if(result.isLeft()) throw new BadRequestException();
        
        const { questionAnswers }= result.value;
        
        return { questionAnswers: questionAnswers.map(AnswerPresenter.toHTTP) };
    }
}
