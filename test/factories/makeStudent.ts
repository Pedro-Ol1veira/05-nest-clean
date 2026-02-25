import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prismaStudentMapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeStudent(orverride: Partial<StudentProps> = {}, id?: UniqueEntityID) {
  const newStudent = Student.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...orverride
  }, id);

  return newStudent;
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student>{
    const student = makeStudent(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}