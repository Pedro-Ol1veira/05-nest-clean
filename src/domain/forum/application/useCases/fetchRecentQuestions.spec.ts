import { InMemoryQuestionsRepository } from '@/../test/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from '@/../test/factories/makeQuestion';
import { FetchRecentQuestionsUseCase } from './fetchRecentQuestions';
import { InMemoryQuestionAttachmentRepository } from '@/../test/repositories/InMemoryQuestionAttachmentRepository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: FetchRecentQuestionsUseCase;
describe('Fetch Recent Questions', () => {

    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
    })

    it('Should be able to fetch recent questions', async () => {
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20)}));
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 18)}));
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 23)}));

        const result = await sut.execute({
            page: 1
        });

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ])
    });

    it('Should be able to fetch paginated recent questions', async () => {
        for(let i = 1; i <= 22; i++) {
            await inMemoryQuestionsRepository.create(makeQuestion());
        }

        const result = await sut.execute({
            page: 2,
        });

        expect(result.value?.questions).toHaveLength(2);
    });
    
})

