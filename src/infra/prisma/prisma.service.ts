import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    constructor(config: ConfigService<Env, true>) {
        const connectionString = process.env.DATABASE_URL ?? "";
        const url = new URL(connectionString);
        const schema = url.searchParams.get('schema');
        const adapter = new PrismaPg({ connectionString }, { schema: schema ?? "public" });
        super({ adapter });
    }
    
    onModuleInit() {
        return this.$connect()
    }
    
    onModuleDestroy() {
        return this.$disconnect()
    }

}