import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answerAttachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachments(data: Partial<AnswerAttachmentProps> = {}): Promise<AnswerAttachment>{
    const answerAttachment = makeAnswerAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString()
      },
      data: {
        answerId: answerAttachment.answerId.toString()
      }
    });

    return answerAttachment;
  }
}