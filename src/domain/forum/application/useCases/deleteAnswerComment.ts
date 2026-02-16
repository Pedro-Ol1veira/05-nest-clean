import { Either, left, right } from "@/core/either";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";

interface deleteAnswerCommentUseCaseRequest {
    authorId: string;
    answerCommentId: string;
}

type deleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class deleteAnswerCommentUseCase {
    constructor(
        private answersCommentsRepository: AnswersCommentsRepository
    ) {}
    async execute({ authorId, answerCommentId }: deleteAnswerCommentUseCaseRequest): Promise<deleteAnswerCommentUseCaseResponse> {
        const answerComment = await this.answersCommentsRepository.findById(answerCommentId);

        if(!answerComment) return left(new ResourceNotFoundError());

        if(answerComment.authorId.toString() !== authorId) return left(new NotAllowedError());

        await this.answersCommentsRepository.delete(answerComment);
        
        return right({})
    }
}