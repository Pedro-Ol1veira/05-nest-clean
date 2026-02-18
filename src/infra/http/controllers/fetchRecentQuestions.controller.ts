import { Controller, Body, UseGuards, Get, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import z from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/useCases/fetchRecentQuestions";
import { QuestionPresenter } from "../presenters/questionPresenter";

const pageQueryParamSchema = z.string().optional().transform(Number).pipe(
    z.number().min(1)
).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {

    constructor(private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase) {}
    
    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema){
        const result = await this.fetchRecentQuestions.execute({
            page,
        });

        if(result.isLeft()) throw new Error();
        
        const { questions }= result.value;
        
        return { questions: questions.map(QuestionPresenter.toHTTP) };
    }
}
