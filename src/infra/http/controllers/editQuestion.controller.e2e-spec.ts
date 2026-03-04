import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentsFactory } from "test/factories/makeAttachments";
import { QuestionFactory } from "test/factories/makeQuestion";
import { QuestionAttachmentFactory } from "test/factories/makeQuestionAttachment";
import { StudentFactory } from "test/factories/makeStudent";

describe("Edit question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentsFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentsFactory, QuestionAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentsFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[PUT] /questions/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });
    
    const attachment1 = await attachmentFactory.makePrismaAttachments({
      title: "attachment 1"
    });
    const attachment2 = await attachmentFactory.makePrismaAttachments({
      title: "attachment 2"
    });
    
    const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

    
    await questionAttachmentFactory.makePrismaQuestionAttachments({
      attachmentId: attachment1.id,
      questionId: question.id
    });

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      attachmentId: attachment2.id,
      questionId: question.id
    });

    const attachment3 = await attachmentFactory.makePrismaAttachments();
    
    const questionId = question.id.toString();
    
    
    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: "New title",
        content: "New content",
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString(),
        ]
      });

    expect(response.statusCode).toBe(204);

    
    const questionOnDatabase = await prisma.question.findFirst({
      where: { 
        title: "New title",
        content: "New content"
     },
    });

    expect(questionOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id
      }
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
