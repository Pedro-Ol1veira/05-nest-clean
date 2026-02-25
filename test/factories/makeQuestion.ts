import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prismaQuestionMapper';

export function makeQuestion(orverride: Partial<QuestionProps> = {}, id?: UniqueEntityID) {
  const title = faker.lorem.sentence();
  const newQuestion = Question.create({
    title,
    slug: Slug.create(title),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...orverride
  }, id);

  return newQuestion;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question>{
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}