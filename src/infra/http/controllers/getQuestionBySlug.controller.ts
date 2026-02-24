import { Controller, Get, BadRequestException, Param } from "@nestjs/common";
import { getQuestionBySlugUseCase } from "@/domain/forum/application/useCases/getQuestionBySlug";
import { QuestionPresenter } from "../presenters/questionPresenter";

@Controller('/questions/:slug')
export class GetQuestionBySlugController {

    constructor(private readonly getQuestionBySlug: getQuestionBySlugUseCase) {}
    
    @Get()
    async handle(@Param('slug') slug: string){
        const result = await this.getQuestionBySlug.execute({
            slug,
        });

        if(result.isLeft()) throw new BadRequestException();
        
        const { question }= result.value;
        
        return { question: QuestionPresenter.toHTTP(question) };
    }
}
