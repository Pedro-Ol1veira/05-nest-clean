import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/createAccount.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/createQuestion.controller";
import { FetchRecentQuestionsController } from "./controllers/fetchRecentQuestions.controller";
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DatabaseModule } from "../database/database.module";


@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    PrismaService
  ]
})
export class HttpModule {

}