import { Either, right } from "@/core/either";
import { AnswerComments } from "../../enterprise/entities/answerComment";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/commentWIthAuthor";

interface FetchAnswerCommentsUseCaseRequest {
    page: number;
    answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<
    null,
    {
        comments: CommentWithAuthor[];
    }
> 

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(
        private answerCommentsRepository: AnswersCommentsRepository,
    ) {}
    async execute({ page, answerId }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
        const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, { page });

        return right({ comments });
    }
}