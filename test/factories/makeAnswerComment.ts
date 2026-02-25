import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswerComments, AnswerCommentsProps } from "@/domain/forum/enterprise/entities/answerComment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prismaAnswerCommentMapper";

export function makeAnswerComment(
  orverride: Partial<AnswerCommentsProps> = {},
  id?: UniqueEntityID,
) {
  const answerComment = AnswerComments.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...orverride,
    },
    id,
  );

  return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentsProps> = {}): Promise<AnswerComments>{
    const answercomment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answercomment),
    });

    return answercomment;
  }
}