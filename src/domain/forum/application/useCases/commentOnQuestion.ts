import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionsRepository } from "../repositories/questionRepository";
import { QuestionComments } from "../../enterprise/entities/questionComment";
import { QuestionsCommentsRepository } from "../repositories/questionCommentsRepository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { Injectable } from "@nestjs/common";

interface CommentOnQuestionUseCaseRequest {
    authorId: string;
    questionId: string;
    content: string;
}

type CommentOnQuestionUseCaseResponse = Either< 
    ResourceNotFoundError,
    {
        questionComment: QuestionComments;
    }
>;

@Injectable()
export class CommentOnQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionsCommentsRepository: QuestionsCommentsRepository
    ) {}
    async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if(!question) return left(new ResourceNotFoundError());

        const questionComment = QuestionComments.create({
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
            content,
        });

        await this.questionsCommentsRepository.create(questionComment);

        return right({ questionComment });
    }
}