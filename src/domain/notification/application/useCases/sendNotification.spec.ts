import { SendNotificationUseCase } from './sendNotification';
import { InMemoryNotificationRepository } from '@/../test/repositories/InMemoryNotificationRepository';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;
describe('Send Notification', () => {

    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationRepository();
        sut = new SendNotificationUseCase(inMemoryNotificationRepository);
    })

    it('Should be able to send a notification', async () => {
        const result = await sut.execute({
            content: "conteudo teste",
            title: "Title",
            recipientId: '1'
        });
        
        
        expect(result.isRight()).toBe(true);
        expect(inMemoryNotificationRepository.items[0]).toEqual(result.value?.notification);
    });
    
})

