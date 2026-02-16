import { InMemoryQuestionsRepository } from '@/../test/repositories/InMemoryQuestionsRepository';
import { getQuestionBySlugUseCase } from './getQuestionBySlug';
import { makeQuestion } from '@/../test/factories/makeQuestion';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { InMemoryQuestionAttachmentRepository } from '@/../test/repositories/InMemoryQuestionAttachmentRepository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: getQuestionBySlugUseCase;
describe('Get Question By Slug', () => {

    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
        sut = new getQuestionBySlugUseCase(inMemoryQuestionsRepository);
    })

    it('Should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create("example-question")
        });
        inMemoryQuestionsRepository.create(newQuestion)
        
        const result = await sut.execute({
            slug: 'example-question'
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title
            })
        });
    });
    
})

