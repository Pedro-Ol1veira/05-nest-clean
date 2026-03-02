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
import { GetQuestionBySlugController } from "./controllers/getQuestionBySlug.controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/useCases/getQuestionBySlug";
import { EditQuestionController } from "./controllers/editQuestion.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/useCases/editQuestion";
import { DeleteQuestionUseCase } from "@/domain/forum/application/useCases/deleteQuestion";
import { DeleteQuestionController } from "./controllers/deleteQuestion.controller";
import { AnswerQuestionController } from "./controllers/answerQuestion.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/useCases/answerQuestion";
import { EditAnswerController } from "./controllers/editAnswer.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/useCases/editAnswer";
import { DeleteAnswerUseCase } from "@/domain/forum/application/useCases/deleteAnswer";
import { DeleteAnswerController } from "./controllers/deleteAnswer.controller";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/useCases/fetchQuestionsAnswers";
import { FetchQuestionAnswersController } from "./controllers/fetchQuestionAnswers.controller";
import { ChoseQuestionBestAnswerController } from "./controllers/choseQuestionBestAnswer.controller";
import { ChoseQuestionBestAnswerUseCase } from "@/domain/forum/application/useCases/choseQuestionBestAnswer";
import { CommentOnQuestionController } from "./controllers/commentOnQuestion.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/useCases/commentOnQuestion";
import { DeleteQuestionCommentController } from "./controllers/deleteQuestionComment.controller";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/useCases/deleteQuestionComment";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/useCases/commentOnAnswer";
import { CommentOnAnswerController } from "./controllers/commentOnAnswer.controller";
import { DeleteAnswerCommentController } from "./controllers/deleteAnswerComment.controller";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/useCases/deleteAnswerComment";
import { FetchQuestionCommentsController } from "./controllers/fetchQuestionComments.controller";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/useCases/fetchQuestionComments";
import { FetchAnswerCommentsController } from "./controllers/fetchAnswerComments.controller";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/useCases/fetchAnswerComments";
import { UploadAttachmentController } from "./controllers/uploadAttachment.controller";


@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChoseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChoseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
  ]
})
export class HttpModule {

}