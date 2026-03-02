import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionComments } from "../../enterprise/entities/questionComment";

export abstract class QuestionsCommentsRepository {
    abstract findById(id: string): Promise<QuestionComments | null>;
    abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComments[]>;
    abstract create(questionComment: QuestionComments): Promise<void>;
    abstract delete(questionComment: QuestionComments): Promise<void>;
}
