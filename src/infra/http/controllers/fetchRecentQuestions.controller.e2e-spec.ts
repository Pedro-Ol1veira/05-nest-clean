import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/makeQuestion";
import { StudentFactory } from "test/factories/makeStudent";

describe("Fetch Recent Questions (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[Get] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({authorId: user.id, title: "question 01"}),
      questionFactory.makePrismaQuestion({authorId: user.id, title: "question 02"}),
      questionFactory.makePrismaQuestion({authorId: user.id, title: "question 03"}),
    ])

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        questions: expect.arrayContaining([
            expect.objectContaining({ title: "question 01"}),
            expect.objectContaining({ title: "question 02"}),
            expect.objectContaining({ title: "question 03"}),
        ])
    });

  });
});
