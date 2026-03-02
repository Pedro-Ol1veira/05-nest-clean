import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prismaQuestionsRepository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prismaQuestionCommentsRepository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prismaQuestionsAttachmentsRepository";
import { PrismaAnswersRepository } from "./prisma/repositories/prismaAnswersRepository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prismaAnswerCommentsRepository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prismaAnswerAttachmentsRepository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questionRepository";
import { StudentsRepository } from "@/domain/forum/application/repositories/studentsRepository";
import { PrismaStudentsRepository } from "./prisma/repositories/prismaStudentsRepository";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questionCommentsRepository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/questionAttachmentsRepository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answersRepository";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answerCommentsRepository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answerAttachmentsRepository";


@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository
        },
        {
            provide: StudentsRepository,
            useClass: PrismaStudentsRepository
        },
        {
            provide: QuestionsCommentsRepository,
            useClass: PrismaQuestionCommentsRepository
        },
        {
            provide: QuestionAttachmentsRepository,
            useClass: PrismaQuestionAttachmentsRepository
        },
        {
            provide: AnswersRepository,
            useClass: PrismaAnswersRepository
        },
        {
            provide: AnswersCommentsRepository,
            useClass: PrismaAnswerCommentsRepository
        },
        {
            provide: AnswerAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository
        }
    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        StudentsRepository,
        QuestionsCommentsRepository,
        QuestionAttachmentsRepository,
        AnswersRepository,
        AnswersCommentsRepository,
        AnswerAttachmentsRepository
    ]
})
export class DatabaseModule {}