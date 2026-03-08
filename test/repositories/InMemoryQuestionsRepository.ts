import { DomainEvents } from "@/core/events/domainEvents";
import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questionRepository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/questionDetails";
import { InMemoryAttachmentsRepository } from "./InMemoryAttachmentsRepository";
import { InMemoryStudentsRepository } from "./InMemoryStudentsRepository";
import { InMemoryQuestionAttachmentRepository } from "./InMemoryQuestionAttachmentRepository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}
  
  async create(question: Question): Promise<void> {
    this.items.push(question);
    
    this.questionAttachmentRepository.createMany(question.attachments.getItems());
    
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) return null;

    return question;
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    await this.questionAttachmentRepository.deleteManyByQuestionId(question.id.toString());
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.questionAttachmentRepository.createMany(question.attachments.getNewItems());
    this.questionAttachmentRepository.deleteMany(question.attachments.getRemovedItems());
    
    this.items[itemIndex] = question;
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    const author = this.studentsRepository.items.find(student => student.id.equals(question.authorId));

    if(!author) throw new Error(`Author with id ${question.authorId.toString()} does not exists`);

    const questionAttachments = this.questionAttachmentRepository.items.filter(questionAttachments => questionAttachments.questionId.equals(question.id));

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.attachmentsRepository.items.find(attachment => attachment.id.equals(questionAttachment.attachmentId));

      if(!attachment) throw new Error(`Attachment with id ${questionAttachment.attachmentId} does not exists`);

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }
}
