import { InMemoryQuestionCommentsRepository } from "@/../test/repositories/InMemoryQuestionCommentsRepository";
import { deleteQuestionCommentUseCase } from "./deleteQuestionComment";
import { makeQuestionComment } from "@/../test/factories/makeQuestionComment";
import { NotAllowedError } from "../../../../core/errors/errors/notAllowedError";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: deleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new deleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("Should be able to delete comment on question", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete comment on question from another user", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      authorId: "author1",
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
