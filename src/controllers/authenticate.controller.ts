import { UnauthorizedException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from 'zod';
import { ZodValidationPipe } from "src/pipes/zodValidationPipe";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";

const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string()
});

type authenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {

    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
    ) {}
    
    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: authenticateBodySchema) {
        const { email, password } = body;
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if(!user) throw new UnauthorizedException("Invalid Credentials");

        const isPasswordValid = await compare(password, user.password);

        if(!isPasswordValid) throw new UnauthorizedException("Invalid Credentials");

        const accessToken = this.jwt.sign({ sub: user.id });

        return { accessToken };

    }
}
