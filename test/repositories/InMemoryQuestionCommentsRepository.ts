import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questionCommentsRepository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/questionComment";

export class InMemoryQuestionCommentsRepository implements QuestionsCommentsRepository {
  public items: QuestionComments[] = [];

  async create(questioncomment: QuestionComments): Promise<void> {
    this.items.push(questioncomment);
  }

  async findById(id: string): Promise<QuestionComments | null> {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async delete(questionComment: QuestionComments): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComments[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() == questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

}
