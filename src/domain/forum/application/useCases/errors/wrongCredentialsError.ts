import { UseCaseError } from "@/core/errors/useCaseError";

export class WrongCredentialsError extends Error implements UseCaseError {
    constructor() {
        super(`Invalid credentials`);
    }
}