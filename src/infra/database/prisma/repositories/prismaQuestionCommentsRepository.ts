import { PaginationParams } from "@/core/repositories/paginationParams";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questionCommentsRepository";
import { QuestionComments } from "@/domain/forum/enterprise/entities/questionComment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prismaQuestionCommentMapper";
import { PrismaCommentWithAuthorMapper } from "../mappers/prismaCommentWithAuthorMapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/commentWIthAuthor";


@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionsCommentsRepository {
    constructor(private prisma: PrismaService) {}
    
    async findById(id: string): Promise<QuestionComments | null> {
        const questionComment = await this.prisma.comment.findUnique({
            where: {
                id
            }
        });

        if(!questionComment) return null;

        return PrismaQuestionCommentMapper.toDomain(questionComment);
    }
    async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComments[]> {
        const questionComments = await this.prisma.comment.findMany({
            where: {
                questionId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
        });

        return questionComments.map(PrismaQuestionCommentMapper.toDomain);
    }

    async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
        const questionComments = await this.prisma.comment.findMany({
            where: {
                questionId
            },
            include: {
                author: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
        });

        return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
    }
    
    async create(questionComment: QuestionComments): Promise<void> {
        const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

        await this.prisma.comment.create({
            data
        });
    }
    async delete(questionComment: QuestionComments): Promise<void> {
        await this.prisma.comment.delete({
            where: {
                id: questionComment.id.toString()
            }
        });
    }
}