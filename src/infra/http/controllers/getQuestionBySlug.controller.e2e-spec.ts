import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentsFactory } from "test/factories/makeAttachments";
import { QuestionFactory } from "test/factories/makeQuestion";
import { QuestionAttachmentFactory } from "test/factories/makeQuestionAttachment";
import { StudentFactory } from "test/factories/makeStudent";

describe("Get Question By Slug (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentsFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionFactory: QuestionFactory; 
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentsFactory, QuestionAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory =  moduleRef.get(AttachmentsFactory);
    questionAttachmentFactory =  moduleRef.get(QuestionAttachmentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[Get] /questions/:slug", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "teste"
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    });

    const attachment = await attachmentFactory.makePrismaAttachments({
      title: "Some title"
    });

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        question: expect.objectContaining({ 
          title: question.title,
          author: "teste",
          attachments: [
            expect.objectContaining({
              title: "Some title"
            })
          ]
        }),
    });

  });
});
