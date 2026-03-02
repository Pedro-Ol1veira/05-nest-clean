import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswerComments } from "../../enterprise/entities/answerComment";

export abstract class AnswersCommentsRepository {
    abstract create(answerComment: AnswerComments): Promise<void>;
    abstract delete(answerComment: AnswerComments): Promise<void>;
    abstract findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComments[]>;
    abstract findById(id: string): Promise<AnswerComments | null>;
}
