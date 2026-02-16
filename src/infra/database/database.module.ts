import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prismaQuestionsRepository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prismaQuestionCommentsRepository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prismaQuestionsAttachmentsRepository";
import { PrismaAnswersRepository } from "./prisma/repositories/prismaAnswersRepository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prismaAnswerCommentsRepository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prismaAnswerAttachmentsRepository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questionRepository";


@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository
        },
        PrismaQuestionCommentsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository
    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        PrismaQuestionCommentsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository
    ]
})
export class DatabaseModule {}