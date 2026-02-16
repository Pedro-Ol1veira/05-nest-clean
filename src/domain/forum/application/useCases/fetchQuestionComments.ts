import { Either, right } from "@/core/either";
import { QuestionComments } from "../../enterprise/entities/questionComment";
import { QuestionsCommentsRepository } from "../repositories/questionCommentsRepository";

interface fetchQuestionCommentsUseCaseRequest {
    page: number;
    questionId: string;
}

type fetchQuestionCommentsUseCaseResponse = Either<null,
    {
        questionComments: QuestionComments[];
    }
>;

export class fetchQuestionCommentsUseCase {
    constructor(
        private questionCommentsRepository: QuestionsCommentsRepository,
    ) {}
    async execute({ page, questionId }: fetchQuestionCommentsUseCaseRequest): Promise<fetchQuestionCommentsUseCaseResponse> {
        const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });

        return right({ questionComments });
    }
}