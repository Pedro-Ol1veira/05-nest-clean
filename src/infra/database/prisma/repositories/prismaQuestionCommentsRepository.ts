import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questionCommentsRepository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/questionComment";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionsCommentsRepository {
    findById(id: string): Promise<QuestionComments | null> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComments[]> {
        throw new Error("Method not implemented.");
    }
    create(questionComment: QuestionComments): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(questionComment: QuestionComments): Promise<void> {
        throw new Error("Method not implemented.");
    }
}