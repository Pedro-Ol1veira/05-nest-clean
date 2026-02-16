import { InMemoryAnswerCommentsRepository } from "@/../test/repositories/InMemoryAnswerCommentsRepository";
import { deleteAnswerCommentUseCase } from "./deleteAnswerComment";
import { makeAnswerComment } from "@/../test/factories/makeAnswerComment";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: deleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new deleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("Should be able to delete comment on answer", async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete comment on answer from another user", async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      authorId: "author1",
      answerCommentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
