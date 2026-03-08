import { makeAnswer } from "@/../test/factories/makeAnswer"
import { InMemoryAnswersRepository } from "@/../test/repositories/InMemoryAnswersRepository"
import { InMemoryAnswerAttachmentRepository } from "@/../test/repositories/InMemoryAnsewerAttachmentsRepository";
import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";
import { SendNotificationUseCase } from "../useCases/sendNotification";
import { InMemoryNotificationRepository } from "@/../test/repositories/InMemoryNotificationRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { MockInstance } from 'vitest';
import { waitFor } from "@/../test/utils/waitFor";
import { OnQuestionBestAnswerChosen } from "./onQuestionBestAnswerChosen";
import { InMemoryAttachmentsRepository } from "test/repositories/InMemoryAttachmentsRepository";
import { InMemoryStudentsRepository } from "test/repositories/InMemoryStudentsRepository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository; 
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sendNotificationExecuteSpy: MockInstance;


describe('On Question Best Answer Chosen', () => {
    beforeEach(() => {
      inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
      inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
          inMemoryQuestionAttachmentRepository,
          inMemoryAttachmentsRepository,
          inMemoryStudentsRepository,
        );
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
        inMemoryNotificationRepository = new InMemoryNotificationRepository();
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationRepository);

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
        
        new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUseCase);
    })

    
  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id});
    
    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionsRepository.save(question);
    
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    });
  })
  
})
