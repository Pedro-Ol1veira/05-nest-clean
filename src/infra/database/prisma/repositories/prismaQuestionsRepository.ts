import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questionRepository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prismaQuestionMapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/questionAttachmentsRepository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/questionDetails";
import { PrismaQuestionWithDetailsMapper } from "../mappers/prismaQuestionDetailsMapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {

    constructor(
        private prisma: PrismaService,
        private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}
    
    async create(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question);

        await this.prisma.question.create({
            data,
        });

        await this.questionAttachmentsRepository.createMany(question.attachments.getItems());
    }
    async save(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question);

        await Promise.all([
            this.prisma.question.update({
                where: {
                    id: data.id
                },
                data
            }),
            this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
            this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())
        ])
    }
    
    async findBySlug(slug: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug
            }
        });
        
        if(!question) return null;
        
        return PrismaQuestionMapper.toDomain(question);
    }

    async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug
            },
            include: {
                author: true,
                attachments: true,
            }
        });
        
        if(!question) return null;
        
        return PrismaQuestionWithDetailsMapper.toDomain(question);
    }

    async delete(question: Question): Promise<void> {
        await this.prisma.question.delete({
            where: {
                id: question.id.toString()
            },
        });
    }
    async findById(id: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                id
            }
        });
        
        if(!question) return null;
        
        return PrismaQuestionMapper.toDomain(question);
    }
    async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
        });

        return questions.map(PrismaQuestionMapper.toDomain);
    }

}