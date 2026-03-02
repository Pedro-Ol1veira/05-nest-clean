import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { AnswersRepository } from "../repositories/answersRepository";
import { QuestionsRepository } from "../repositories/questionRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { Injectable } from "@nestjs/common";

interface ChoseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChoseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class ChoseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}
  async execute({ answerId, authorId }: ChoseQuestionBestAnswerUseCaseRequest): Promise<ChoseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) return left(new ResourceNotFoundError());

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    );
    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString()) return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
