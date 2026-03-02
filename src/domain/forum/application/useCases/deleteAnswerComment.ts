import { Either, left, right } from "@/core/either";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string;
    answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

@Injectable()
export class DeleteAnswerCommentUseCase {
    constructor(
        private answersCommentsRepository: AnswersCommentsRepository
    ) {}
    async execute({ authorId, answerCommentId }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
        const answerComment = await this.answersCommentsRepository.findById(answerCommentId);

        if(!answerComment) return left(new ResourceNotFoundError());

        if(answerComment.authorId.toString() !== authorId) return left(new NotAllowedError());

        await this.answersCommentsRepository.delete(answerComment);
        
        return right({})
    }
}