import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Attachment, AttachmentProps } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prismaAttachmentMapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAttachments(orverride: Partial<AttachmentProps> = {}, id?: UniqueEntityID) {
  const newAttachments = Attachment.create({
    title: faker.lorem.slug(),
    url: faker.lorem.slug(),
    ...orverride
  }, id);

  return newAttachments;
}

@Injectable()
export class AttachmentsFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachments(data: Partial<AttachmentProps> = {}): Promise<Attachment>{
    const attachments = makeAttachments(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachments),
    });

    return attachments;
  }
}