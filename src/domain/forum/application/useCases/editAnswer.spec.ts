import { InMemoryAnswersRepository } from "@/../test/repositories/InMemoryAnswersRepository";
import { makeAnswer } from "@/../test/factories/makeAnswer";
import { editAnswerUseCase } from "./editAnswer";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { InMemoryAnswerAttachmentRepository } from "@/../test/repositories/InMemoryAnsewerAttachmentsRepository";
import { makeAnswerAttachment } from "@/../test/factories/makeAnswerAttachment";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: editAnswerUseCase;
describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    sut = new editAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentRepository);
  });

  it("Should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );
    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )
    
    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "author-1",
      content: "Novo conteudo",
      attachmentsIds: ['1', '3']
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "Novo conteudo",
    });
    expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toEqual([
        expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
        expect.objectContaining({attachmentId: new UniqueEntityID('3')}),
    ]);
  });

  it("Should be not able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );
    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "author-2",
      content: "Novo conteudo",
      attachmentsIds: []
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
