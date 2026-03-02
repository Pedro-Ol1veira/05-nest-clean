import { Either, left, right } from "@/core/either";
import { QuestionsCommentsRepository } from "../repositories/questionCommentsRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionCommentUseCaseRequest {
    authorId: string;
    questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>

@Injectable()
export class DeleteQuestionCommentUseCase {
    constructor(
        private questionsCommentsRepository: QuestionsCommentsRepository
    ) {}
    async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
        const questionComment = await this.questionsCommentsRepository.findById(questionCommentId);

        if(!questionComment) return left(new ResourceNotFoundError());

        if(questionComment.authorId.toString() !== authorId) return left(new NotAllowedError());

        await this.questionsCommentsRepository.delete(questionComment);
        
        return right({});
    }
}