import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answerCommentsRepository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answerComment";

export class InMemoryAnswerCommentsRepository implements AnswersCommentsRepository {
  public items: AnswerComments[] = [];

  async create(answercomment: AnswerComments): Promise<void> {
    this.items.push(answercomment);
  }

  async findById(id: string): Promise<AnswerComments | null> {
    const answerComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!answerComment) return null;

    return answerComment;
  }

  async delete(questionComment: AnswerComments): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByAnswerId(
      answerId: string,
      { page }: PaginationParams,
    ): Promise<AnswerComments[]> {
      const answercomment = this.items
        .filter((item) => item.answerId.toString() == answerId)
        .slice((page - 1) * 20, page * 20);
  
      return answercomment;
    }
}
