import { InMemoryQuestionsRepository } from '@/../test/repositories/InMemoryQuestionsRepository';
import { createQuestionUseCase } from './createQuestion';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { InMemoryQuestionAttachmentRepository } from '@/../test/repositories/InMemoryQuestionAttachmentRepository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: createQuestionUseCase;
describe('Create Question', () => {

    beforeEach(() => {
        inMemoryQuestionAttachmentRepository =
              new InMemoryQuestionAttachmentRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository);
        sut = new createQuestionUseCase(inMemoryQuestionsRepository);
    })

    it('Should be able to create a question', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: "Nova pergunta",
            content: "Conteudo da pergunta",
            attachmentsIds: ['1', '2']
        });
        
        
        expect(result.isRight()).toBe(true);
        expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question);
        expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toHaveLength(2);
        expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('2')}),
        ]);
    });
    
})

