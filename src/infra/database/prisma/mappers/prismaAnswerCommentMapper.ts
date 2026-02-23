import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answerComment";
import { Comment as PrismaComment, Prisma } from "prisma/generated/client";


export class PrismaAnswerCommentMapper{
    static toDomain(raw: PrismaComment): AnswerComments {
        if(!raw.answerId) throw new Error("Invalid content type");

        return AnswerComments.create({
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            answerId: new UniqueEntityID(raw.answerId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(answercomment: AnswerComments): Prisma.CommentUncheckedCreateInput {
        return {
            id: answercomment.id.toString(),
            authorId: answercomment.authorId.toString(),
            answerId: answercomment.answerId.toString(),
            content: answercomment.content,
            createdAt: answercomment.createdAt,
            updatedAt: answercomment.updatedAt
        }
    }
}