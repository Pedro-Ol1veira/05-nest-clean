import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { DomainEvent } from "@/core/events/domainEvent";
import { Question } from "../entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
    public ocurredAt: Date;
    public question: Question;
    public bestAnswerId: UniqueEntityID;

    constructor(question: Question, bestAnserId: UniqueEntityID) {
        this.question = question;
        this.bestAnswerId = bestAnserId;
        this.ocurredAt = new Date();
    } 
    
    getAggregateId(): UniqueEntityID {
        return this.question.id;
    }
}