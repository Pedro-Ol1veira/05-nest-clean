import { UseCaseError } from "@/core/errors/useCaseError";

export class StudentAlreadyExistsError extends Error implements UseCaseError {
    constructor(identifier: string) {
        super(`Student "${identifier}" already exists`);
    }
}