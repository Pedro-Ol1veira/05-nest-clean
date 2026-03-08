import { Controller, Get, BadRequestException, Param } from "@nestjs/common";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/useCases/getQuestionBySlug";
import { QuestionDetailsPresenter } from "../presenters/questionDetailsPresenter";

@Controller('/questions/:slug')
export class GetQuestionBySlugController {

    constructor(private  getQuestionBySlug: GetQuestionBySlugUseCase) {}
    
    @Get()
    async handle(@Param('slug') slug: string){
        const result = await this.getQuestionBySlug.execute({
            slug,
        });

        if(result.isLeft()) throw new BadRequestException();
        
        const { question }= result.value;
        
        return { question: QuestionDetailsPresenter.toHTTP(question) };
    }
}
