import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/makeAnswer";
import { AnswerCommentFactory } from "test/factories/makeAnswerComment";
import { QuestionFactory } from "test/factories/makeQuestion";
import { QuestionCommentFactory } from "test/factories/makeQuestionComment";
import { StudentFactory } from "test/factories/makeStudent";

describe("Fetch answer comments (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory, AnswerCommentFactory, AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[Get] /answers/:answerId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({ name: "teste" });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

    const answer = await answerFactory.makePrismaAnswer({ questionId: question.id, authorId: user.id });

    await Promise.all([
        answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: 'Comment 01' }),
        answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: 'Comment 02' }),
        answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: 'Comment 03' }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
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
