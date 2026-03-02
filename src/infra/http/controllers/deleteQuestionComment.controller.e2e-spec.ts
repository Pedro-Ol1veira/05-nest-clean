import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/makeAnswer";
import { QuestionFactory } from "test/factories/makeQuestion";
import { QuestionCommentFactory } from "test/factories/makeQuestionComment";
import { StudentFactory } from "test/factories/makeStudent";

describe("Delete question comment (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[DELETE] /questions/comments/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

    const comment = await questionCommentFactory.makePrismaQuestionComment({ questionId: question.id, authorId: user.id});
    
    
    const response = await request(app.getHttpServer())
    .delete(`/questions/comments/${comment.id.toString()}`)
    .set('Authorization', `Bearer ${accessToken}`)

    
    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.comment.findUnique({
      where: { 
        id: comment.id.toString()
     },
    });

    expect(answerOnDatabase).toBeNull();
  });
});
