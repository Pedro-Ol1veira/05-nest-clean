import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answerCommentsRepository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answerComment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prismaAnswerCommentMapper";
import { PrismaCommentWithAuthorMapper } from "../mappers/prismaCommentWithAuthorMapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/commentWIthAuthor";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswersCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComments | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) return null;

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComments[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

   async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
      const answerComments = await this.prisma.comment.findMany({
          where: {
              answerId
          },
          include: {
              author: true
          },
          orderBy: {
              createdAt: 'desc'
          },
          take: 20,
          skip: (page - 1) * 20
      });

      return answerComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComments): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }
  async delete(answerComment: AnswerComments): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }
}
