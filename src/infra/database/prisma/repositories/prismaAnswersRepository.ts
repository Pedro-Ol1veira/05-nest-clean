import { PaginationParams } from "@/core/repositories/paginationParams";
import { AnswersRepository } from "@/domain/forum/application/repositories/answersRepository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
    create(answer: Answer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Answer | null> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(parms: PaginationParams, questionId: string): Promise<Answer[]> {
        throw new Error("Method not implemented.");
    }
    delete(answer: Answer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    save(answer: Answer): Promise<void> {
        throw new Error("Method not implemented.");
    }
}