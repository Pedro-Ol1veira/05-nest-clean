import { AnswerAttachment } from "../../enterprise/entities/answerAttachment";

export abstract class AnswerAttachmentsRepository {
    abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
    abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
