import { UploadAndCreateAttachmentUseCase } from "./uploadAndCreateAttachments";
import { InMemoryAttachmentsRepository } from "test/repositories/InMemoryAttachmentsRepository";
import { FakeUploader } from "test/storage/fakeUploader";
import { InvalidAttachmentType } from "./errors/invalidAttachmentType";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  it("Should be able to upload and create and attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  it("Should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  });
});
