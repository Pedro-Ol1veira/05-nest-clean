import { Either, right } from "@/core/either";
import { QuestionComments } from "../../enterprise/entities/questionComment";
import { QuestionsCommentsRepository } from "../repositories/questionCommentsRepository";
import { Injectable } from "@nestjs/common";

interface FetchQuestionCommentsUseCaseRequest {
    page: number;
    questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<null,
    {
        questionComments: QuestionComments[];
    }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(
        private questionCommentsRepository: QuestionsCommentsRepository,
    ) {}
    async execute({ page, questionId }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
        const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });

        return right({ questionComments });
    }
}