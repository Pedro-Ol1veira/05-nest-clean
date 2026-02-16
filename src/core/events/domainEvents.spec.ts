import { AggregateRoot } from "../entities/aggregateRoot";
import { UniqueEntityID } from "../entities/uniqueEntityId";
import { DomainEvent } from "./domainEvent";
import { DomainEvents } from "./domainEvents";
import { vi } from 'vitest';

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date;
    private aggregate: CustomAggregate;

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }
    
    public getAggregateId(): UniqueEntityID {
        return this.aggregate.id
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null);

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

        return aggregate;
    }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {

    const callbackSpy = vi.fn();
    
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toBeCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  })
  
})
