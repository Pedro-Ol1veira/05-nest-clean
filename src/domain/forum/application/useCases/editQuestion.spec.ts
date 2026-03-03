import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { EditQuestionUseCase } from "./editQuestion";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";
import { makeQuestionAttachment } from "@/../test/factories/makeAttachmentRepository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;
describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentRepository);
  });

  it("Should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Testando edição",
      content: "Novo conteudo",
      attachmentsIds: ['1', '3']
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Testando edição",
      content: "Novo conteudo",
    });
    expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toHaveLength(2);
    expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual([
        expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
        expect.objectContaining({attachmentId: new UniqueEntityID('3')}),
    ]);
  });

  it("Should be not able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-2",
      title: "Testando edição",
      content: "Novo conteudo",
      attachmentsIds: []
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("Should sync new and removed attachment when editing a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "Testando edição",
      content: "Novo conteudo",
      attachmentsIds: ['1', '3']
    });
    
    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                attachmentId: new UniqueEntityID('1'),
            }),
            expect.objectContaining({
                attachmentId: new UniqueEntityID('3'),
            }),
        ])
    )
  });
});
