import { InMemoryQuestionCommentsRepository } from '@/../test/repositories/InMemoryQuestionCommentsRepository';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { FetchQuestionCommentsUseCase } from './fetchQuestionComments';
import { makeQuestionComment } from '@/../test/factories/makeQuestionComment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;
describe('Fetch Question Comment', () => {

    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
    })

    it('Should be able to fetch question comment', async () => {
        await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-1')}));
        await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-1')}));
        await inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('question-1')}));

        const result = await sut.execute({
            questionId: "question-1",
            page: 1
        });

        expect(result.value?.questionComments).toHaveLength(3);
    });

    it('Should be able to fetch paginated question comment', async () => {
        for(let i = 1; i <= 22; i++) {
            await inMemoryQuestionCommentsRepository.create(makeQuestionComment({questionId: new UniqueEntityID("question-1")}));
        }

        const result = await sut.execute({
            questionId: "question-1",
            page: 2,
        });

        expect(result.value?.questionComments).toHaveLength(2);
    });
    
})

