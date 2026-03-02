import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/makeAnswer";
import { QuestionFactory } from "test/factories/makeQuestion";
import { StudentFactory } from "test/factories/makeStudent";

describe("Fetch Question Answers (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory, AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[Get] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({authorId: user.id});

    await Promise.all([
        answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 01' }),
        answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 02' }),
        answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 03' }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`);


    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        questionAnswers: expect.arrayContaining([
            expect.objectContaining({ content: "Answer 01"}),
            expect.objectContaining({ content: "Answer 02"}),
            expect.objectContaining({ content: "Answer 03"}),
        ])
    });

  });
});
