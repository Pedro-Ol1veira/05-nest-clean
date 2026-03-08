import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { DeleteQuestionUseCase } from "./deleteQuestion";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";
import { makeQuestionAttachment } from "test/factories/makeQuestionAttachment";
import { InMemoryAttachmentsRepository } from "test/repositories/InMemoryAttachmentsRepository";
import { InMemoryStudentsRepository } from "test/repositories/InMemoryStudentsRepository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: DeleteQuestionUseCase;
describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("Should be able to delete a question", async () => {
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
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await sut.execute({
      questionId: "question-1",
      authorId: "author-1",
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  it("Should be not able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-1",
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
