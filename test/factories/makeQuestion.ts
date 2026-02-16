import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export function makeQuestion(orverride: Partial<QuestionProps> = {}, id?: UniqueEntityID) {
  const newQuestion = Question.create({
    title: faker.lorem.sentence(),
    slug: Slug.create("example-question"),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...orverride
  }, id);

  return newQuestion;
}
