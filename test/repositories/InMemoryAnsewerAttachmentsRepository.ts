import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answerAttachmentsRepository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answerAttachment";

export class InMemoryAnswerAttachmentRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];
  
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
