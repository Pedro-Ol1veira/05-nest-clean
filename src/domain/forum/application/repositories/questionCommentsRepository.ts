import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionComments } from "../../enterprise/entities/questionComment";

export interface QuestionsCommentsRepository {
    findById(id: string): Promise<QuestionComments | null>;
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComments[]>;
    create(questionComment: QuestionComments): Promise<void>;
    delete(questionComment: QuestionComments): Promise<void>;
}
