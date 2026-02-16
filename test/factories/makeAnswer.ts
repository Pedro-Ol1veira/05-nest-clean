import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export function makeAnswer(orverride: Partial<AnswerProps> = {}, id?: UniqueEntityID) {
  const newAnswer = Answer.create({
    questionId: new UniqueEntityID(),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...orverride
  }, id);

  return newAnswer;
}
