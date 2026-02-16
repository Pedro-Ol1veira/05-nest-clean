import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answersRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { AnswerAttachmentList } from "../../enterprise/entities/answerAttachmentList";
import { AnswerAttachmentsRepository } from "../repositories/answerAttachmentsRepository";
import { AnswerAttachment } from "../../enterprise/entities/answerAttachment";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";

interface editAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
    attachmentsIds: string[];
}

type editAnswerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answer: Answer;
    }
> 

export class editAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}
    async execute({ answerId, content, authorId, attachmentsIds }: editAnswerUseCaseRequest): Promise<editAnswerUseCaseResponse> {
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

        this.answersRepository.save(answer);
        return right({ answer });
    }
}