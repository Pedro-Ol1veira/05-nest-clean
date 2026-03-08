import { QuestionsRepository } from "../repositories/questionRepository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/questionDetails";

interface GetQuestionBySlugUseCaseRequest {
    slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        question: QuestionDetails;
    }
> 

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}
    async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.findDetailsBySlug(slug);

        if(!question) return left(new ResourceNotFoundError());
        
        return right({ question });
    }
}