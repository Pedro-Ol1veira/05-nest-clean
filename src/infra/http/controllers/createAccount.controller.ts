import { BadRequestException, ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from 'zod';
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import { RegisterStudentUseCase } from "@/domain/forum/application/useCases/registerStudent";
import { StudentAlreadyExistsError } from "@/domain/forum/application/useCases/errors/studentAlreadyExistsError";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {

    constructor(private readonly registerStudent: RegisterStudentUseCase) {}
    
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password } = body;

        const result = await this.registerStudent.execute({
            name,
            email,
            password
        });

        if(result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case StudentAlreadyExistsError:
                    throw new ConflictException(error.message);
                default:
                    throw new BadRequestException(error.message);
            }
        }
    }
}
