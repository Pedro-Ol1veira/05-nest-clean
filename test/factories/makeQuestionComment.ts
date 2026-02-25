import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionComments, QuestionCommentsProps } from "@/domain/forum/enterprise/entities/questionComment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prismaQuestionCommentMapper";

export function makeQuestionComment(
  orverride: Partial<QuestionCommentsProps> = {},
  id?: UniqueEntityID,
) {
  const questionComment = QuestionComments.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...orverride,
    },
    id,
  );

  return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(data: Partial<QuestionCommentsProps> = {}): Promise<QuestionComments>{
    const questioncomment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questioncomment),
    });

    return questioncomment;
  }
}