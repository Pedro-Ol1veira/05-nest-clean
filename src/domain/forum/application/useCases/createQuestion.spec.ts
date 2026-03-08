import { InMemoryQuestionsRepository } from '@/../test/repositories/InMemoryQuestionsRepository';
import { CreateQuestionUseCase } from './createQuestion';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { InMemoryQuestionAttachmentRepository } from '@/../test/repositories/InMemoryQuestionAttachmentRepository';
import { InMemoryAttachmentsRepository } from 'test/repositories/InMemoryAttachmentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CreateQuestionUseCase;
describe('Create Question', () => {

    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionAttachmentRepository =
              new InMemoryQuestionAttachmentRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository,
        );
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
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

    it('Should persist attachments when creating a question', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: "Nova pergunta",
            content: "Conteudo da pergunta",
            attachmentsIds: ['1', '2']
        });
        
        
        expect(result.isRight()).toBe(true);
        expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
        expect(inMemoryQuestionAttachmentRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    attachmentId: new UniqueEntityID('1'),
                }),
                expect.objectContaining({
                    attachmentId: new UniqueEntityID('2'),
                }),
            ])
        )
    });
    
})

