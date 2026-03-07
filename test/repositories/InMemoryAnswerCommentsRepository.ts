import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answerCommentsRepository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answerComment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/commentWIthAuthor";
import { InMemoryStudentsRepository } from "./InMemoryStudentsRepository";

export class InMemoryAnswerCommentsRepository implements AnswersCommentsRepository {
  public items: AnswerComments[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

  async delete(answerComment: AnswerComments): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
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

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {

    
    const answerComments = this.items
    .filter((item) => item.answerId.toString() == answerId)
    .slice((page - 1) * 20, page * 20)
    .map(comment => {
        const author = this.studentsRepository.items.find(student => student.id.equals(comment.authorId));

        if(!author) throw new Error(`Authro with id ${comment.authorId.toString()} doesn't exists`);
        
        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          author: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return answerComments;
  }
}
