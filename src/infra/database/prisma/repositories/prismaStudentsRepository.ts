import { PaginationParams } from "@/core/repositories/paginationParams";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prismaQuestionMapper";
import { StudentsRepository } from "@/domain/forum/application/repositories/studentsRepository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaStudentMapper } from "../mappers/prismaStudentMapper";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {

    constructor(private  prisma: PrismaService) {}
    
    async create(student: Student): Promise<void> {
        const data = PrismaStudentMapper.toPrisma(student);
        
        await this.prisma.user.create({
            data,
        })
    }
    
    async findByEmail(email: string): Promise<Student | null> {
        const student = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!student) return null;

        return PrismaStudentMapper.toDomain(student);

    }

}