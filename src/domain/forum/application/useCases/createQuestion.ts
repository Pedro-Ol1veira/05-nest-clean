import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionsRepository } from "../repositories/questionRepository";
import { Question } from "../../enterprise/entities/question";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/questionAttachment";
import { QuestionAttachmentList } from "../../enterprise/entities/questionAttachmentList";
import { Injectable } from "@nestjs/common";

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });
    question.attachments = new QuestionAttachmentList(questionAttachments);
    
    await this.questionsRepository.create(question);

    return right({ question });
  }
}
