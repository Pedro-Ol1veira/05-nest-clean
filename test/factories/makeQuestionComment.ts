import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionComments, QuestionCommentsProps } from "@/domain/forum/enterprise/entities/questionComment";

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
