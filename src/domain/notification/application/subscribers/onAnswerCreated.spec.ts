import { makeAnswer } from "@/../test/factories/makeAnswer"
import { OnAnswerCreated } from "./onAnswerCreated"
import { InMemoryAnswersRepository } from "@/../test/repositories/InMemoryAnswersRepository"
import { InMemoryAnswerAttachmentRepository } from "@/../test/repositories/InMemoryAnsewerAttachmentsRepository";
import { InMemoryQuestionsRepository } from "@/../test/repositories/InMemoryQuestionsRepository";
import { InMemoryQuestionAttachmentRepository } from "@/../test/repositories/InMemoryQuestionAttachmentRepository";
import { SendNotificationUseCase } from "../useCases/sendNotification";
import { InMemoryNotificationRepository } from "@/../test/repositories/InMemoryNotificationRepository";
import { makeQuestion } from "@/../test/factories/makeQuestion";
import { MockInstance } from 'vitest';
import { waitFor } from "@/../test/utils/waitFor";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository; 
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;


describe('On Answer Created', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
        inMemoryNotificationRepository = new InMemoryNotificationRepository();
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationRepository);

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
        
        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
    })

    
  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id});
    
    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);
    
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    });
  })
  
})
