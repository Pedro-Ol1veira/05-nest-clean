import { UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from 'zod';
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/useCases/authenticateStudent";

const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string()
});

type authenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {

    constructor(
        private readonly authenticateStudent: AuthenticateStudentUseCase,
    ) {}
    
    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: authenticateBodySchema) {
        const { email, password } = body;
        
        const result = await this.authenticateStudent.execute({
            email,
            password
        });

        if(result.isLeft()) throw new Error();

        const { accessToken } = result.value;

        return { accessToken };

    }
}
