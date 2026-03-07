import { InMemoryAnswerCommentsRepository } from '@/../test/repositories/InMemoryAnswerCommentsRepository';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { FetchAnswerCommentsUseCase } from './fetchAnswerComments';
import { makeAnswerComment } from '@/../test/factories/makeAnswerComment';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { makeStudent } from 'test/factories/makeStudent';

let inMemoryStudentsReposytory: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;
describe('Fetch Answer Comment', () => {

    beforeEach(() => {
        inMemoryStudentsReposytory = new InMemoryStudentsRepository()
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsReposytory);
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
    })

    it('Should be able to fetch answer comment', async () => {
        const student = makeStudent({ name: "teste" });

        inMemoryStudentsReposytory.items.push(student);
        
        const comment1 = makeAnswerComment({ answerId: new UniqueEntityID('answer-1'), authorId: student.id})      
        const comment2 = makeAnswerComment({ answerId: new UniqueEntityID('answer-1'), authorId: student.id})
        const comment3 = makeAnswerComment({ answerId: new UniqueEntityID('answer-1'), authorId: student.id})

        await inMemoryAnswerCommentsRepository.create(comment1);
        await inMemoryAnswerCommentsRepository.create(comment2);
        await inMemoryAnswerCommentsRepository.create(comment3);

        const result = await sut.execute({
            answerId: "answer-1",
            page: 1
        });

        expect(result.value?.comments).toHaveLength(3);
        expect(result.value?.comments).toEqual(expect.arrayContaining([
            expect.objectContaining({
                author: "teste",
                commentId: comment1.id
            }),
            expect.objectContaining({
                author: "teste",
                commentId: comment2.id
            }),
            expect.objectContaining({
                author: "teste",
                commentId: comment3.id
            }),
        ]))
    });

    it('Should be able to fetch paginated answer comment', async () => {
        const student = makeStudent({ name: "teste" });

        inMemoryStudentsReposytory.items.push(student);
        
        for(let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(makeAnswerComment({answerId: new UniqueEntityID("answer-1"), authorId: student.id }));
        }

        const result = await sut.execute({
            answerId: "answer-1",
            page: 2,
        });

        expect(result.value?.comments).toHaveLength(2);
    });
    
})

