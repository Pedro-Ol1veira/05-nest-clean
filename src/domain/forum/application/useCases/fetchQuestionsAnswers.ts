import { AnswersRepository } from "../repositories/answersRepository";
import { Answer } from "../../enterprise/entities/answer";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface FetchQuestionAnswersUseCaseRequest {
    page: number;
    questionId: string;
}

type FetchQuestionAnswersUseCaseResponse = Either<
    null,
    {
        questionAnswers: Answer[];
    }
> 

@Injectable()
export class FetchQuestionAnswersUseCase {
    constructor(
        private questionanswersRepository: AnswersRepository,
    ) {}
    async execute({ page, questionId }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
        const questionAnswers = await this.questionanswersRepository.findManyByQuestionId({ page }, questionId);

        return right({ questionAnswers });
    }
}