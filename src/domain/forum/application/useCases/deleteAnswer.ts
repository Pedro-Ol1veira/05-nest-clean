import { Either, left, right } from "@/core/either";
import { AnswersRepository } from "../repositories/answersRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerUseCaseRequest {
    answerId: string;
    authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>;

@Injectable()
export class DeleteAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) {}
    async execute({ answerId, authorId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {

        const answer = await this.answersRepository.findById(answerId);
        
        if(!answer) return left(new ResourceNotFoundError());

        if(authorId !== answer.authorId.toString()) return left(new NotAllowedError());

        this.answersRepository.delete(answer);
        return right({});
    }
}