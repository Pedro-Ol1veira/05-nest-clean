import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/makeAnswer";
import { AnswerAttachmentFactory } from "test/factories/makeAnswerAttachment";
import { AttachmentsFactory } from "test/factories/makeAttachments";
import { QuestionFactory } from "test/factories/makeQuestion";
import { StudentFactory } from "test/factories/makeStudent";

describe("Edit answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentsFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AttachmentsFactory, AnswerAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentsFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

    const attachment1 = await attachmentFactory.makePrismaAttachments();
    const attachment2 = await attachmentFactory.makePrismaAttachments();
    
    
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id
    });
    
    await answerAttachmentFactory.makePrismaAnswerAttachments({
      attachmentId: attachment1.id,
      answerId: answer.id
    });
    
    await answerAttachmentFactory.makePrismaAnswerAttachments({
      attachmentId: attachment2.id,
      answerId: answer.id
    });
    
    const attachment3 = await attachmentFactory.makePrismaAttachments();

    
    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: "Edit answer",
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString()
        ]
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: { 
        content: "Edit answer"
     },
    });

    expect(answerOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id
      }
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
