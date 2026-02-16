import { InMemoryAnswerCommentsRepository } from '@/../test/repositories/InMemoryAnswerCommentsRepository';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { fetchAnswerCommentsUseCase } from './fetchAnswerComments';
import { makeAnswerComment } from '@/../test/factories/makeAnswerComment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: fetchAnswerCommentsUseCase;
describe('Fetch Answer Comment', () => {

    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
        sut = new fetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
    })

    it('Should be able to fetch answer comment', async () => {
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-1')}));
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-1')}));
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('answer-1')}));

        const result = await sut.execute({
            answerId: "answer-1",
            page: 1
        });

        expect(result.value?.answerComments).toHaveLength(3);
    });

    it('Should be able to fetch paginated answer comment', async () => {
        for(let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(makeAnswerComment({answerId: new UniqueEntityID("answer-1")}));
        }

        const result = await sut.execute({
            answerId: "answer-1",
            page: 2,
        });

        expect(result.value?.answerComments).toHaveLength(2);
    });
    
})

