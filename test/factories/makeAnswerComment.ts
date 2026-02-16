import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswerComments, AnswerCommentsProps } from "@/domain/forum/enterprise/entities/answerComment";

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
