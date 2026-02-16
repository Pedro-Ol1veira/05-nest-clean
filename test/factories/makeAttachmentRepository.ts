import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionAttachment, QuestionAttachmentProps } from "@/domain/forum/enterprise/entities/questionAttachment";

export function makeQuestionAttachment(
  orverride: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...orverride,
    },
    id,
  );

  return questionAttachment;
}
