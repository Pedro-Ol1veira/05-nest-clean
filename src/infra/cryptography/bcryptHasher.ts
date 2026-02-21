import { HashCompare } from "@/domain/forum/application/cryptography/hashCompare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hashGenerator";
import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashCompare {

    hash(plain: string): Promise<string> {
        return hash(plain, 8)
    }
    compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash)
    }
    
}