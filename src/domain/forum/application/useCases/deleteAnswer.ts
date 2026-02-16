import { Either, left, right } from "@/core/either";
import { AnswersRepository } from "../repositories/answersRepository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";

interface deleteAnswerUseCaseRequest {
    answerId: string;
    authorId: string;
}

type deleteAnswerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>;

export class deleteAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) {}
    async execute({ answerId, authorId }: deleteAnswerUseCaseRequest): Promise<deleteAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if(!answer) return left(new ResourceNotFoundError());

        if(authorId !== answer.authorId.toString()) return left(new NotAllowedError());

        this.answersRepository.delete(answer);
        return right({});
    }
}