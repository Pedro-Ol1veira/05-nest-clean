import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { InMemoryQuestionCommentsRepository } from "@/../test/repositories/InMemoryQuestionCommentsRepository";
import { CommentOnQuestionUseCase } from "./commentOnQuestion";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";
import { InMemoryAttachmentsRepository } from "test/repositories/InMemoryAttachmentsRepository";
import { InMemoryStudentsRepository } from "test/repositories/InMemoryStudentsRepository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment On Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it("Should be able to comment on question", async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
        questionId: question.id.toString(),
        authorId: question.authorId.toString(),
        content: "Comentario teste"
    });

    expect(inMemoryQuestionCommentsRepository.items[0]?.content).toEqual(
      "Comentario teste"
    );
  });
  
});
