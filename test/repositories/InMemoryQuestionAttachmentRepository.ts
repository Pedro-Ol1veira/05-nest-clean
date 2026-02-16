import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/questionAttachmentsRepository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/questionAttachment";

export class InMemoryQuestionAttachmentRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];
  
  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachment = this.items
    .filter((item) => item.questionId.toString() == questionId);
    
    return questionAttachment;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(item => item.questionId.toString() !== questionId);

    this.items = questionAttachments;
  }

}
