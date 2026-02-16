import { Either, left, right } from "@/core/either";
import { QuestionsCommentsRepository } from "../repositories/questionCommentsRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";

interface deleteQuestionCommentUseCaseRequest {
    authorId: string;
    questionCommentId: string;
}

type deleteQuestionCommentUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>

export class deleteQuestionCommentUseCase {
    constructor(
        private questionsCommentsRepository: QuestionsCommentsRepository
    ) {}
    async execute({ authorId, questionCommentId }: deleteQuestionCommentUseCaseRequest): Promise<deleteQuestionCommentUseCaseResponse> {
        const questionComment = await this.questionsCommentsRepository.findById(questionCommentId);

        if(!questionComment) return left(new ResourceNotFoundError());

        if(questionComment.authorId.toString() !== authorId) return left(new NotAllowedError());

        await this.questionsCommentsRepository.delete(questionComment);
        
        return right({});
    }
}