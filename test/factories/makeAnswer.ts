import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prismaAnswerMapper';

export function makeAnswer(orverride: Partial<AnswerProps> = {}, id?: UniqueEntityID) {
  const newAnswer = Answer.create({
    questionId: new UniqueEntityID(),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...orverride
  }, id);

  return newAnswer;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer>{
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}