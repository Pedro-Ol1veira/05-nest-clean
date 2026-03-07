import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/makeQuestion";
import { QuestionCommentFactory } from "test/factories/makeQuestionComment";
import { StudentFactory } from "test/factories/makeStudent";

describe("Fetch question comments (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory, QuestionCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[Get] /questions/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "teste"
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({authorId: user.id});

    await Promise.all([
        questionCommentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: 'Comment 01' }),
        questionCommentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: 'Comment 02' }),
        questionCommentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: 'Comment 03' }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`);


    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        comments: expect.arrayContaining([
            expect.objectContaining({ content: "Comment 01", authorName: 'teste'}),
            expect.objectContaining({ content: "Comment 02", authorName: 'teste'}),
            expect.objectContaining({ content: "Comment 03", authorName: 'teste'}),
        ])
    });

  });
});
