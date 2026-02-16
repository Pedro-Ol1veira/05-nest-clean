import { NotificationRepository } from "../repositories/notificationRepository";
import { Notification } from "../../enterprise/entities/notification";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resourceNotFoundError";
import { NotAllowedError } from "@/core/errors/errors/notAllowedError";

interface ReadNotificationUseCaseRequest {
    recipientId: string;
    notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) {}
  async execute({
    notificationId,
    recipientId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {

    const notification = await this.notificationsRepository.findById(notificationId);

    if(!notification) return left(new ResourceNotFoundError());

    if(recipientId !== notification.recipientId.toString()) return left(new NotAllowedError());

    notification.read();

    await this.notificationsRepository.save(notification);
    
    return right({ notification });
  }
}
