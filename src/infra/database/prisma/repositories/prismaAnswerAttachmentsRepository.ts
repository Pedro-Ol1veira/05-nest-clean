import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answerAttachmentsRepository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answerAttachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prismaAnswerAttachmentMapper";


@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
    constructor(private prisma: PrismaService) {}

     async createMany(attachments: AnswerAttachment[]): Promise<void> {
        if(attachments.length === 0) return;
        
        const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);
        await this.prisma.attachment.updateMany(data)
    }

    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) return;

        const attachmentsIds = attachments.map(item => {
            return item.id.toString()
        });

        await this.prisma.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentsIds
                }
            }
        });
    }

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