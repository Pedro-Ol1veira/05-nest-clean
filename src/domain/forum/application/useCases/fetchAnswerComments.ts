import { Either, right } from "@/core/either";
import { AnswerComments } from "../../enterprise/entities/answerComment";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";

interface fetchAnswerCommentsUseCaseRequest {
    page: number;
    answerId: string;
}

type fetchAnswerCommentsUseCaseResponse = Either<
    null,
    {
        answerComments: AnswerComments[];
    }
> 

export class fetchAnswerCommentsUseCase {
    constructor(
        private answerCommentsRepository: AnswersCommentsRepository,
    ) {}
    async execute({ page, answerId }: fetchAnswerCommentsUseCaseRequest): Promise<fetchAnswerCommentsUseCaseResponse> {
        const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });

        return right({ answerComments });
    }
}