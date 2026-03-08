import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma } from "prisma/generated/client";
import { Attachment as PrismaAttachment } from 'prisma/generated/client'; 

export class PrismaAttachmentMapper {

    static toPrisma(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
        }
    }

    static toDomain(attachment: PrismaAttachment): Attachment {
        return Attachment.create({
            title: attachment.title,
            url: attachment.url,
        }, new UniqueEntityID(attachment.id));
    }
}