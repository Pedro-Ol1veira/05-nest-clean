import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswersRepository } from "../repositories/answersRepository";
import { AnswerComments } from "../../enterprise/entities/answerComment";
import { AnswersCommentsRepository } from "../repositories/answerCommentsRepository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";

interface commentOnAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

type commentOnAnswerUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        answerComment: AnswerComments;
    }
>;

export class commentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answersCommentsRepository: AnswersCommentsRepository
    ) {}
    async execute({ authorId, answerId, content }: commentOnAnswerUseCaseRequest): Promise<commentOnAnswerUseCaseResponse> {
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