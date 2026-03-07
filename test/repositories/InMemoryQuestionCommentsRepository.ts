import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questionCommentsRepository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/questionComment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/commentWIthAuthor";
import { InMemoryStudentsRepository } from "./InMemoryStudentsRepository";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";

export class InMemoryQuestionCommentsRepository implements QuestionsCommentsRepository {
  public items: QuestionComments[] = [];

  constructor(
    private studentsRepository: InMemoryStudentsRepository,
  ) {}
  
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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {

    
    const questionComments = this.items
    .filter((item) => item.questionId.toString() == questionId)
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

    return questionComments;
  }

}
