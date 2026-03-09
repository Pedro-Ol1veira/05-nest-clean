import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/makeNotification";
import { StudentFactory } from "test/factories/makeStudent";

describe("Read notification (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let notificationFactory: NotificationFactory;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory, PrismaService]
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[PATCH] /notifications/:notificationId/read", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "teste"
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
        recipientId: user.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
            recipientId: user.id.toString()
        }
    });

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  });
});
