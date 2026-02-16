import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/createAccount.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/createQuestion.controller";
import { FetchRecentQuestionsController } from "./controllers/fetchRecentQuestions.controller";
import { PrismaService } from "../prisma/prisma.service";


@Module({
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