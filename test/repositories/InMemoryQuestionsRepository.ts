import { DomainEvents } from "@/core/events/domainEvents";
import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/questionAttachmentsRepository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questionRepository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(private questionAttachmentRepository: QuestionAttachmentsRepository) {}
  
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
}
