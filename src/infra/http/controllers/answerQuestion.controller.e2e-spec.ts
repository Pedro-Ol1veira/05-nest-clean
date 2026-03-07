import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentsFactory } from "test/factories/makeAttachments";
import { QuestionFactory } from "test/factories/makeQuestion";
import { StudentFactory } from "test/factories/makeStudent";

describe("Answer question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentsFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentsFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentsFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[POST] /questions/:questioId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

    const attachmet1 = await attachmentFactory.makePrismaAttachments();
    const attachmet2 = await attachmentFactory.makePrismaAttachments();
    
    const questionId = question.id.toString();
    
    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: "New answer",
        attachments: [
          attachmet1.id.toString(),
          attachmet2.id.toString(),
        ]
      });

    expect(response.statusCode).toBe(201);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: { 
        content: "New answer"
     },
    });

    expect(answerOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      }
    });

    expect(attachmentOnDatabase).toHaveLength(2);
  });
});
