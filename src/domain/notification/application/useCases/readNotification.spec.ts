import { makeNotification } from '@/../test/factories/makeNotification';
import { ReadNotificationUseCase } from './readNotification';
import { InMemoryNotificationRepository } from '@/../test/repositories/InMemoryNotificationRepository';
import { UniqueEntityID } from '@/core/entities/uniqueEntityId';
import { NotAllowedError } from '@/core/errors/errors/notAllowedError';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;
describe('Read Notification', () => {

    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationRepository();
        sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
    })

    it('Should be able to read a notification', async () => {
        const notification = makeNotification();
        await inMemoryNotificationRepository.create(notification);

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        });
        
        
        expect(result.isRight()).toBe(true);
        expect(inMemoryNotificationRepository.items[0]?.readAt).toEqual(expect.any(Date));
    });
    
    it("Should be not able to read a notification from another user", async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('1')
        });

        await inMemoryNotificationRepository.create(notification);

        const result = await sut.execute({
            recipientId: '2',
            notificationId: notification.id.toString(),
        });
        
        
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
      });
})

