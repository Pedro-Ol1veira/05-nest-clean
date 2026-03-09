import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prismaNotificationMapper';

export function makeNotification(orverride: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
  const newNotification = Notification.create({
    recipientId: new UniqueEntityID(),
    title: faker.lorem.sentence(4),
    content: faker.lorem.sentence(10),
    ...orverride
  }, id);

  return newNotification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(data: Partial<NotificationProps> = {}): Promise<Notification>{
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}