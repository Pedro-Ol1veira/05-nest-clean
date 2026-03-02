import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswersRepository } from "../repositories/answersRepository";
import { AnswerComments } from "../../enterprise/entities/answerComment";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { Injectable } from "@nestjs/common";

interface CommentOnAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        answerComment: AnswerComments;
    }
>;

@Injectable()
export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answersCommentsRepository: AnswersCommentsRepository
    ) {}
    async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if(!answer) return left(new ResourceNotFoundError());

        const answerComment = AnswerComments.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content,
        });

        await this.answersCommentsRepository.create(answerComment);

        return right({ answerComment });
    }
}