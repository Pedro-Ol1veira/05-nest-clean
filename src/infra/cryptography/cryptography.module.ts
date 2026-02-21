import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwtEncrypter";
import { HashGenerator } from "@/domain/forum/application/cryptography/hashGenerator";
import { HashCompare } from "@/domain/forum/application/cryptography/hashCompare";
import { BcryptHasher } from "./bcryptHasher";

@Module({
    providers: [
        { provide: Encrypter, useClass: JwtEncrypter },
        {provide: HashCompare, useClass: BcryptHasher},
        {provide: HashGenerator, useClass: BcryptHasher},
    ],
    exports: [
        Encrypter,
        HashCompare,
        HashGenerator
    ]
})
export class CryptographyModule {
    
}