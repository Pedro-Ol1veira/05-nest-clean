import { InMemoryQuestionCommentsRepository } from '@/../test/repositories/InMemoryQuestionCommentsRepository';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { FetchQuestionCommentsUseCase } from './fetchQuestionComments';
import { makeQuestionComment } from '@/../test/factories/makeQuestionComment';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { makeStudent } from 'test/factories/makeStudent';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;
describe('Fetch Question Comment', () => {

    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
    })

    it('Should be able to fetch question comment', async () => {

        const student = makeStudent({ name: "teste" });

        inMemoryStudentsRepository.items.push(student);
        
        const comment1 = makeQuestionComment({ questionId: new UniqueEntityID('question-1'), authorId: student.id});
        const comment2 = makeQuestionComment({ questionId: new UniqueEntityID('question-1'), authorId: student.id});
        const comment3 = makeQuestionComment({ questionId: new UniqueEntityID('question-1'), authorId: student.id});
        
        await inMemoryQuestionCommentsRepository.create(comment1);
        await inMemoryQuestionCommentsRepository.create(comment2);
        await inMemoryQuestionCommentsRepository.create(comment3);

        const result = await sut.execute({
            questionId: "question-1",
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

    it('Should be able to fetch paginated question comment', async () => {

        const student = makeStudent({ name: "teste" });

        inMemoryStudentsRepository.items.push(student);

        for(let i = 1; i <= 22; i++) {
            await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID("question-1"), authorId: student.id }));
        }

        const result = await sut.execute({
            questionId: "question-1",
            page: 2,
        });

        expect(result.value?.comments).toHaveLength(2);
    });
    
})

