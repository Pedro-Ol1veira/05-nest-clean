import { AuthenticateStudentUseCase } from './authenticateStudent';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { FakeEncrypter } from 'test/cryptography/fakeEncrypter';
import { FakeHasher } from 'test/cryptography/fakeHasher';
import { makeStudent } from 'test/factories/makeStudent';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {

    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();        
        fakeHasher = new FakeHasher();
        fakeEncrypter = new FakeEncrypter();
        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter);
    })

    it('Should be able to authenticate a student', async () => {
        
        const student = makeStudent({
            email: "teste@example.com",
            password: await fakeHasher.hash('123456'),
        });

        inMemoryStudentsRepository.items.push(student);
        
        const result = await sut.execute({
            email: "teste@example.com",
            password: '123456'
        });
        
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        });
    });
    
})

