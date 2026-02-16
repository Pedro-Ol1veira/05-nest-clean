import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prismaQuestionsRepository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prismaQuestionCommentsRepository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prismaQuestionsAttachmentsRepository";
import { PrismaAnswersRepository } from "./prisma/repositories/prismaAnswersRepository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prismaAnswerCommentsRepository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prismaAnswerAttachmentsRepository";


@Module({
    providers: [
        PrismaService,
        PrismaQuestionsRepository,
        PrismaQuestionCommentsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository
    ],
    exports: [
        PrismaService,
        PrismaQuestionsRepository,
        PrismaQuestionCommentsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository
    ]
})
export class DatabaseModule {}