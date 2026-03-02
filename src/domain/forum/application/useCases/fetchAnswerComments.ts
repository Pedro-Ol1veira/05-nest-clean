import { Either, right } from "@/core/either";
import { AnswerComments } from "../../enterprise/entities/answerComment";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";
import { Injectable } from "@nestjs/common";

interface FetchAnswerCommentsUseCaseRequest {
    page: number;
    answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<
    null,
    {
        answerComments: AnswerComments[];
    }
> 

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(
        private answerCommentsRepository: AnswersCommentsRepository,
    ) {}
    async execute({ page, answerId }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
        const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });

        return right({ answerComments });
    }
}