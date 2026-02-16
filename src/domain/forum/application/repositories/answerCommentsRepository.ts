import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswerComments } from "../../enterprise/entities/answerComment";

export interface AnswersCommentsRepository {
    create(answerComment: AnswerComments): Promise<void>;
    delete(answerComment: AnswerComments): Promise<void>;
    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComments[]>;
    findById(id: string): Promise<AnswerComments | null>;
}
