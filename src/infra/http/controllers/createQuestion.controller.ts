import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/currentUserDecorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zodValidationPipe";
import { PrismaService } from "src/infra/prisma/prisma.service";
import z from "zod";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
});

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;


@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {

    constructor(private readonly prisma: PrismaService) {}
    
    @Post()
    async handle(
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { content, title } = body;
        const { sub: userId } = user;

        const slug = this.convertToSlug(title);
        
        await this.prisma.question.create({
            data: {
                title,
                content,
                slug,
                authorId: userId,
            }
        });
    }

    private convertToSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFC')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }
}
