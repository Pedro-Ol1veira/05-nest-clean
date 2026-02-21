import { RegisterStudentUseCase } from './registerStudent';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { FakeHasher } from 'test/cryptography/fakeHasher';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {

    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();        
        fakeHasher = new FakeHasher();
        sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
    })

    it('Should be able to register a student', async () => {
        
        const result = await sut.execute({
            email: "teste@example.com",
            name: "teste",
            password: '123456'
        });
        
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            student: inMemoryStudentsRepository.items[0]
        });
    });

    it('Should hash student password upon registration', async () => {
        
        const result = await sut.execute({
            email: "teste@example.com",
            name: "teste",
            password: '123456'
        });
        
        expect(result.isRight()).toBe(true);
        expect(inMemoryStudentsRepository.items[0].password).toEqual('123456-hashed');
    });
    
})

