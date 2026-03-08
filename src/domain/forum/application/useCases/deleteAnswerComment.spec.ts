import { InMemoryAnswerCommentsRepository } from "@/../test/repositories/InMemoryAnswerCommentsRepository";
import { DeleteAnswerCommentUseCase } from "./deleteAnswerComment";
import { makeAnswerComment } from "@/../test/factories/makeAnswerComment";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";
import { InMemoryStudentsRepository } from "test/repositories/InMemoryStudentsRepository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
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
