import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student';
import { faker } from "@faker-js/faker";

export function makeStudent(orverride: Partial<StudentProps> = {}, id?: UniqueEntityID) {
  const newStudent = Student.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...orverride
  }, id);

  return newStudent;
}
