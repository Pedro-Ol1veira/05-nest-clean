import { DomainEvents } from "@/core/events/domainEvents";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/makeAnswer";
import { QuestionFactory } from "test/factories/makeQuestion";
import { StudentFactory } from "test/factories/makeStudent";
import { waitFor } from "test/utils/waitFor";

describe("On question best answer chosen (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;
    
    await app.init();
  });

  it("Should send a notification when question best answer is chosen", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id });
    
    const answer = await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id
    });
    
    const response = await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/chose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`);

    
    await waitFor(async () => {
        const notificationOnDatabase = await prisma.notification.findFirst({
            where: {
                recipientId: user.id.toString()
            }
        });
        
        expect(notificationOnDatabase).not.toBeNull();
    })
  });
});
