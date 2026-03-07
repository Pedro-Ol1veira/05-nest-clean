import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answerAttachment";
import { Prisma, Attachment as PrismaAttachment } from "prisma/generated/client";


export class PrismaAnswerAttachmentMapper{
    static toDomain(raw: PrismaAttachment): AnswerAttachment {
        if(!raw.answerId) throw new Error("Invalid content type");

        return AnswerAttachment.create({
            answerId: new UniqueEntityID(raw.answerId),
            attachmentId: new UniqueEntityID(raw.id)
        }, new UniqueEntityID(raw.id));
    }

    static toPrismaUpdateMany(attachments: AnswerAttachment[]): Prisma.AttachmentUpdateManyArgs {
            const attachmentsIds = attachments.map((item) => {
                return item.attachmentId.toString()
            });
    
            return {
                where: {
                    id: {
                        in: attachmentsIds
                    }
                },
                data: {
                    answerId: attachments[0].answerId.toString()
                }
            }
        }
}