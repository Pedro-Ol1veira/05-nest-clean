import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answerAttachment";

export function makeAnswerAttachment(
  orverride: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...orverride,
    },
    id,
  );

  return answerAttachment;
}
