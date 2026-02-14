import { Controller, Body, UseGuards, Get, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "src/pipes/zodValidationPipe";
import { PrismaService } from "src/prisma/prisma.service";
import z from "zod";

const pageQueryParamSchema = z.string().optional().transform(Number).pipe(
    z.number().min(1)
).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {

    constructor(private readonly prisma: PrismaService) {}
    
    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema){
        const questions = await this.prisma.question.findMany({
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { questions };
    }
}
