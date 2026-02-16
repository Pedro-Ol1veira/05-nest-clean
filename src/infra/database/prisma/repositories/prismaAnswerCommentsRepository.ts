import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answerCommentsRepository";
import { AnswerComments } from "@/domain/forum/enterprise/entities/answerComment";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PrismaAnswerCommentsRepository implements AnswersCommentsRepository {
    create(answerComment: AnswerComments): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(answerComment: AnswerComments): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComments[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<AnswerComments | null> {
        throw new Error("Method not implemented.");
    }

}