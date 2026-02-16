import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questionRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { QuestionAttachmentsRepository } from "../repositories/questionAttachmentsRepository";
import { QuestionAttachmentList } from "../../enterprise/entities/questionAttachmentList";
import { QuestionAttachment } from "../../enterprise/entities/questionAttachment";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";

interface editQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  questionId: string;
  attachmentsIds: string[];
}

type editQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class editQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}
  async execute({
    questionId,
    title,
    content,
    authorId,
    attachmentsIds,
  }: editQuestionUseCaseRequest): Promise<editQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError());

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);
    question.attachments = questionAttachmentList;
    
    question.title = title;
    question.content = content;

    this.questionsRepository.save(question);
    return right({ question });
  }
}
