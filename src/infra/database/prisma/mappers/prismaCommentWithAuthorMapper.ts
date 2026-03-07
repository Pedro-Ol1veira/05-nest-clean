import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/commentWIthAuthor";
import { Comment as PrismaComment, User as PrismaUser} from "prisma/generated/client";

type PrismaCommentWithAuthor = PrismaComment & {
    author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
        return CommentWithAuthor.create({
            commentId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.authorId),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}