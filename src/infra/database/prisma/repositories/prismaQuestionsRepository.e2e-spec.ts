import { QuestionsRepository } from "@/domain/forum/application/repositories/questionRepository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cacheRepository";
import { CacheModule } from "@/infra/cache/chache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentsFactory } from "test/factories/makeAttachments";
import { QuestionFactory } from "test/factories/makeQuestion";
import { QuestionAttachmentFactory } from "test/factories/makeQuestionAttachment";
import { StudentFactory } from "test/factories/makeStudent";

describe("Prisma questions repository (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentsFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionFactory: QuestionFactory; 
  let cacheRepository: CacheRepository;
  let questionsRepository: QuestionsRepository;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [StudentFactory, QuestionFactory, AttachmentsFactory, QuestionAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory =  moduleRef.get(AttachmentsFactory);
    questionAttachmentFactory =  moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionsRepository);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  it("Should cache question details", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "teste"
    });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    });

    const attachment = await attachmentFactory.makePrismaAttachments();

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    if(!cached) throw new Error("cache miss");
    
    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: questionDetails?.questionId.toString(),
    }));

  });

  it("Should return cached question details on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "teste"
    });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    });

    const attachment = await attachmentFactory.makePrismaAttachments();

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const slug = question.slug.value;

    // await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }));

    let cached = await cacheRepository.get(`question:${slug}:details`);
    expect(cached).toBeNull();
    
    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    cached = await cacheRepository.get(`question:${slug}:details`);
    expect(cached).not.toBeNull();

    if(!cached) throw new Error("cache miss");
    
    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: questionDetails?.questionId.toString(),
    }));

  });

  it("Should reset question details cache when saving the question", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "teste"
    });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    });

    const attachment = await attachmentFactory.makePrismaAttachments();

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const slug = question.slug.value;

    await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }));

    await questionsRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();

  });
});
