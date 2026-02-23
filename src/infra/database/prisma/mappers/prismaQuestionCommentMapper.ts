import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { QuestionComments } from "@/domain/forum/enterprise/entities/questionComment";
import { Comment as PrismaComment, Prisma } from "prisma/generated/client";


export class PrismaQuestionCommentMapper{
    static toDomain(raw: PrismaComment): QuestionComments {
        if(!raw.questionId) throw new Error("Invalid content type");

        return QuestionComments.create({
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            questionId: new UniqueEntityID(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(questioncomment: QuestionComments): Prisma.CommentUncheckedCreateInput {
        return {
            id: questioncomment.id.toString(),
            authorId: questioncomment.authorId.toString(),
            questionId: questioncomment.questionId.toString(),
            content: questioncomment.content,
            createdAt: questioncomment.createdAt,
            updatedAt: questioncomment.updatedAt
        }
    }
}