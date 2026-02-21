import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/createAccount.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/createQuestion.controller";
import { FetchRecentQuestionsController } from "./controllers/fetchRecentQuestions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/useCases/createQuestion";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/useCases/fetchRecentQuestions";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/useCases/authenticateStudent";
import { RegisterStudentUseCase } from "@/domain/forum/application/useCases/registerStudent";
import { CryptographyModule } from "../cryptography/cryptography.module";


@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
  ]
})
export class HttpModule {

}