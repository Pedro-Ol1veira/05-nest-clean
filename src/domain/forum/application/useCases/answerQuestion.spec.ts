import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { AnswerQuestionUseCase } from './answerQuestion';
import { InMemoryAnswersRepository } from '@/../test/repositories/InMemoryAnswersRepository';
import { InMemoryAnswerAttachmentRepository } from '@/../test/repositories/InMemoryAnsewerAttachmentsRepository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: AnswerQuestionUseCase;
describe('Anwer Question', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository);
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
    })

    it('Should be able to answer a question', async () => {
        const result = await sut.execute({
            authorId: '1',
            questionId: "1",
            content: "Conteudo da pergunta",
            attachmentsIds: ['1', '2']
        });
    
        expect(result.isRight()).toBe(true);
        expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
        expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toHaveLength(2);
        expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('2')}),
        ]);
    });

     it('Should persist attachments when creating a new answer', async () => {
        const result = await sut.execute({
            authorId: '1',
            content: "Conteudo da resposeta",
            questionId: '1',
            attachmentsIds: ['1', '2']
        });
        
        
        expect(result.isRight()).toBe(true);
        expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
        expect(inMemoryAnswerAttachmentRepository.items).toEqual(
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

