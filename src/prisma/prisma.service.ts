import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"
import { ConfigService } from "@nestjs/config";
import { Env } from "src/env";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    constructor(config: ConfigService<Env, true>) {
        const connectionString = config.get('DATABASE_URL', { infer: true });
        const adapter = new PrismaPg({ connectionString });
        super({ adapter });
    }
    
    onModuleInit() {
        return this.$connect()
    }
    
    onModuleDestroy() {
        return this.$disconnect()
    }

}