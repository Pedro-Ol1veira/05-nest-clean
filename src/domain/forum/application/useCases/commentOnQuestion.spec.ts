import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { InMemoryQuestionCommentsRepository } from "@/../test/repositories/InMemoryQuestionCommentsRepository";
import { CommentOnQuestionUseCase } from "./commentOnQuestion";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment On Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
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
