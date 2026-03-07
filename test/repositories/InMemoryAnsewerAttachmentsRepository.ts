import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answerAttachmentsRepository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answerAttachment";

export class InMemoryAnswerAttachmentRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }
  
  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter(item => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = answerAttachments;
  }
  
  async findManyByAnswerId(
    answerId: string,
  ): Promise<AnswerAttachment[]> {
    const answerAttachment = this.items
    .filter((item) => item.answerId.toString() == answerId);
    
    return answerAttachment;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(item => item.answerId.toString() !== answerId);

    this.items = answerAttachments;
  }

}
