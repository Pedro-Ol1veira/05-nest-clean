import { QuestionsRepository } from "../repositories/questionRepository";
import { Question } from "../../enterprise/entities/question";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { Injectable } from "@nestjs/common";

interface getQuestionBySlugUseCaseRequest {
    slug: string;
}

type getQuestionBySlugUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        question: Question;
    }
> 

@Injectable()
export class getQuestionBySlugUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}
    async execute({ slug }: getQuestionBySlugUseCaseRequest): Promise<getQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.findBySlug(slug);

        if(!question) return left(new ResourceNotFoundError());
        
        return right({ question });
    }
}