import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/questionAttachment";
import { Attachment as PrismaAttachment } from "prisma/generated/client";


export class PrismaQuestionAttachmentMapper{
    static toDomain(raw: PrismaAttachment): QuestionAttachment {
        if(!raw.questionId) throw new Error("Invalid content type");

        return QuestionAttachment.create({
            questionId: new UniqueEntityID(raw.questionId),
            attachmentId: new UniqueEntityID(raw.id)
        }, new UniqueEntityID(raw.id));
    }
}