import { Comments } from "@/domain/forum/enterprise/entities/comment";

export class CommentPresenter {
    static toHTTP(comment: Comments<any>) {
        return {
            id: comment.id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }
    }
}