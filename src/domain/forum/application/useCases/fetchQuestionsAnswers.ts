import { AnswersRepository } from "../repositories/answersRepository";
import { Answer } from "../../enterprise/entities/answer";
import { Either, right } from "@/core/either";

interface fetchRecentQuestionAnswerssUseCaseRequest {
    page: number;
    questionId: string;
}

type fetchRecentQuestionAnswerssUseCaseResponse = Either<
    null,
    {
        questionanswerss: Answer[];
    }
> 

export class fetchRecentQuestionAnswerssUseCase {
    constructor(
        private questionanswerssRepository: AnswersRepository,
    ) {}
    async execute({ page, questionId }: fetchRecentQuestionAnswerssUseCaseRequest): Promise<fetchRecentQuestionAnswerssUseCaseResponse> {
        const questionanswerss = await this.questionanswerssRepository.findManyByQuestionId({ page }, questionId);

        return right({ questionanswerss });
    }
}