import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answerAttachmentsRepository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answerAttachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prismaAnswerAttachmentMapper";


@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
    constructor(private prisma: PrismaService) {}

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachment = await this.prisma.attachment.findMany({
            where: {
                answerId,
            }
        });

        return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain);
    }
    async deleteManyByAnswerId(answerId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                answerId
            }
        });
    }
}