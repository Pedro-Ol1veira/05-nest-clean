import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionsRepository } from "../repositories/questionRepository";
import { Question } from "../../enterprise/entities/question";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionUseCaseRequest {
    questionId: string;
    authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>

@Injectable()
export class DeleteQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}
    async execute({ questionId, authorId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if(!question) return left(new ResourceNotFoundError());

        if(authorId !== question.authorId.toString()) return left(new NotAllowedError());

        this.questionsRepository.delete(question);
        return right({ });
    }
}