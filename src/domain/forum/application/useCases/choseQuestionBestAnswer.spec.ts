import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { InMemoryAnswersRepository } from "@/../test/repositories/InMemoryAnswersRepository";
import { ChoseQuestionBestAnswerUseCase } from "./choseQuestionBestAnswer";
import { makeAnswer } from "@/../test/factories/makeAnswer";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";
import { InMemoryAnswerAttachmentRepository } from "@/../test/repositories/InMemoryAnsewerAttachmentsRepository";
import { InMemoryAttachmentsRepository } from "test/repositories/InMemoryAttachmentsRepository";
import { InMemoryStudentsRepository } from "test/repositories/InMemoryStudentsRepository";

let inMemoryAnsersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe("Chose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
    inMemoryAnsersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
    sut = new ChoseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnsersRepository,
    );
  });

  it("Should be able to chose question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnsersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepository.items[0]?.bestAnswerId).toEqual(
      answer.id,
    );
  });

  it("Should be not able to chose question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnsersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "author-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
