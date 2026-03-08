import { InMemoryQuestionsRepository } from '@/../test/repositories/InMemoryQuestionsRepository';
import { GetQuestionBySlugUseCase } from './getQuestionBySlug';
import { makeQuestion } from '@/../test/factories/makeQuestion';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { InMemoryQuestionAttachmentRepository } from '@/../test/repositories/InMemoryQuestionAttachmentRepository';
import { InMemoryAttachmentsRepository } from 'test/repositories/InMemoryAttachmentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { makeStudent } from 'test/factories/makeStudent';
import { makeAttachments } from 'test/factories/makeAttachments';
import { makeQuestionAttachment } from 'test/factories/makeQuestionAttachment';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: GetQuestionBySlugUseCase;
describe('Get Question By Slug', () => {

    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository;
        inMemoryStudentsRepository = new InMemoryStudentsRepository;
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository,
        );
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
    })

    it('Should be able to get a question by slug', async () => {
        const student = makeStudent({ name: "teste" });
        inMemoryStudentsRepository.items.push(student);
        
        const newQuestion = makeQuestion({
            slug: Slug.create("example-question"),
            authorId: student.id
        });
        inMemoryQuestionsRepository.create(newQuestion)

        const attachment = makeAttachments({ title: "some attachment"});
        inMemoryAttachmentsRepository.items.push(attachment);

        inMemoryQuestionAttachmentRepository.items.push(makeQuestionAttachment({
            attachmentId: attachment.id,
            questionId: newQuestion.id
        }));
        
        const result = await sut.execute({
            slug: 'example-question'
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title,
                author: 'teste',
                attachments: [
                    expect.objectContaining({
                        title: 'some attachment'
                    })
                ]
            })
        });
    });
    
})

