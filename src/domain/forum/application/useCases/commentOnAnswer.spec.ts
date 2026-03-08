import { InMemoryAnswersRepository } from "@/../test/repositories/InMemoryAnswersRepository";
import { makeAnswer } from "@/../test/factories/makeAnswer";
import { InMemoryAnswerCommentsRepository } from "@/../test/repositories/InMemoryAnswerCommentsRepository";
import { CommentOnAnswerUseCase } from "./commentOnAnswer";
import { InMemoryAnswerAttachmentRepository } from "@/../test/repositories/InMemoryAnsewerAttachmentsRepository";
import { InMemoryAttachmentsRepository } from "test/repositories/InMemoryAttachmentsRepository";
import { InMemoryStudentsRepository } from "test/repositories/InMemoryStudentsRepository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment On Answer", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
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
