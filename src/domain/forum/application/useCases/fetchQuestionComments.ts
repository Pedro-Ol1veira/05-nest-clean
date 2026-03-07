import { Either, right } from "@/core/either";
import { QuestionsCommentsRepository } from "../repositories/questionCommentsRepository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/commentWIthAuthor";

interface FetchQuestionCommentsUseCaseRequest {
    page: number;
    questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<null,
    {
        comments: CommentWithAuthor[];
    }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(
        private questionCommentsRepository: QuestionsCommentsRepository,
    ) {}
    async execute({ page, questionId }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
        const comments = await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(questionId, { page });

        return right({ comments });
    }
}