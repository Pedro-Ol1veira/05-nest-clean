import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/questionAttachment";
import { Prisma, Attachment as PrismaAttachment } from "prisma/generated/client";


export class PrismaQuestionAttachmentMapper{
    static toDomain(raw: PrismaAttachment): QuestionAttachment {
        if(!raw.questionId) throw new Error("Invalid content type");

        return QuestionAttachment.create({
            questionId: new UniqueEntityID(raw.questionId),
            attachmentId: new UniqueEntityID(raw.id)
        }, new UniqueEntityID(raw.id));
    }

    static toPrismaUpdateMany(attachments: QuestionAttachment[]): Prisma.AttachmentUpdateManyArgs {
        const attachmentsIds = attachments.map(item => {
            return item.attachmentId.toString()
        });

        return {
            where: {
                id: {
                    in: attachmentsIds
                }
            },
            data: {
                questionId: attachments[0].questionId.toString()
            }
        }
    }
}