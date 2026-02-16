import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export function makeNotification(orverride: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
  const newNotification = Notification.create({
    recipientId: new UniqueEntityID(),
    title: faker.lorem.sentence(4),
    content: faker.lorem.sentence(10),
    ...orverride
  }, id);

  return newNotification;
}
