import { DomainEvents } from "@/core/events/domainEvents";
import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answerAttachmentsRepository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answersRepository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(private asnwerAttachmentsRepository: AnswerAttachmentsRepository) {};
  
  async create(answer: Answer): Promise<void> {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) return null;

    return answer;
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);
    this.asnwerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findManyByQuestionId({ page }: PaginationParams, questionId: string): Promise<Answer[]> {
    const answers = this.items
      .filter(item => item.questionId.toString() == questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
