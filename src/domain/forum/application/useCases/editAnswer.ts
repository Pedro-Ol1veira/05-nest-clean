import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answersRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { AnswerAttachmentList } from "../../enterprise/entities/answerAttachmentList";
import { AnswerAttachmentsRepository } from "../repositories/answerAttachmentsRepository";
import { AnswerAttachment } from "../../enterprise/entities/answerAttachment";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Injectable } from "@nestjs/common";

interface EditAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
    attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answer: Answer;
    }
> 

@Injectable()
export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}
    async execute({ answerId, content, authorId, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if(!answer) return left(new ResourceNotFoundError());

        if(authorId !== answer.authorId.toString()) return left(new NotAllowedError());

        const currentAnswerAttachments =
              await this.answerAttachmentsRepository.findManyByAnswerId(answerId);
        
        const answerAttachmentList = new AnswerAttachmentList(
            currentAnswerAttachments,
        );
    
        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
            attachmentId: new UniqueEntityID(attachmentId),
            answerId: answer.id,
            });
        });
    
        
        answer.attachments = answerAttachmentList;
        answerAttachmentList.update(answerAttachments);
        answer.content = content;

        await this.answersRepository.save(answer);
        return right({ answer });
    }
}