import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/questionDetails";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion, User as PrismaUser, Attachment as PrismaAttachment} from "prisma/generated/client";
import { PrismaAttachmentMapper } from "./prismaAttachmentMapper";

type PrismaQuestionWithDetails = PrismaQuestion & {
    author: PrismaUser;
    attachments: PrismaAttachment[];
}

export class PrismaQuestionWithDetailsMapper {
    static toDomain(raw: PrismaQuestionWithDetails): QuestionDetails {
        return QuestionDetails.create({
            questionId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.authorId),
            author: raw.author.name,
            title: raw.title,
            slug: Slug.create(raw.slug),
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}