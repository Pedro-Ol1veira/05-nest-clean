import { InMemoryAnswersRepository } from "@/../test/repositories/InMemoryAnswersRepository";
import { makeAnswer } from "@/../test/factories/makeAnswer";
import { InMemoryAnswerCommentsRepository } from "@/../test/repositories/InMemoryAnswerCommentsRepository";
import { CommentOnAnswerUseCase } from "./commentOnAnswer";
import { InMemoryAnswerAttachmentRepository } from "@/../test/repositories/InMemoryAnsewerAttachmentsRepository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment On Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it("Should be able to comment on answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
        answerId: answer.id.toString(),
        authorId: answer.authorId.toString(),
        content: "Comentario teste"
    });

    expect(inMemoryAnswerCommentsRepository.items[0]?.content).toEqual(
      "Comentario teste"
    );
  });
  
});
