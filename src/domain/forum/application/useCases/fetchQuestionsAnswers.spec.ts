import { fetchRecentQuestionAnswerssUseCase } from './fetchQuestionsAnswers';
import { InMemoryAnswersRepository } from '@/../test/repositories/InMemoryAnswersRepository';
import { makeAnswer } from '@/../test/factories/makeAnswer';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { InMemoryAnswerAttachmentRepository } from '@/../test/repositories/InMemoryAnsewerAttachmentsRepository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: fetchRecentQuestionAnswerssUseCase;
describe('Fetch Question Answers', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
        sut = new fetchRecentQuestionAnswerssUseCase(inMemoryAnswersRepository);
    })

    it('Should be able to fetch question answers', async () => {
        await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-1')}));
        await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-1')}));
        await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('question-1')}));

        const result = await sut.execute({
            questionId: "question-1",
            page: 1
        });

        expect(result.value?.questionanswerss).toHaveLength(3);
    });

    it('Should be able to fetch paginated question answers', async () => {
        for(let i = 1; i <= 22; i++) {
            await inMemoryAnswersRepository.create(makeAnswer({questionId: new UniqueEntityID("question-1")}));
        }

        const result = await sut.execute({
            questionId: "question-1",
            page: 2,
        });

        expect(result.value?.questionanswerss).toHaveLength(2);
    });
    
})

