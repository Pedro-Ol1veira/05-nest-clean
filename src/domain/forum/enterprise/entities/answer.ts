import { AggregateRoot } from "@/core/entities/aggregateRoot";
import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/uniqueEntityId";
import { Optional } from "../../../../core/types/optional";
import { AnswerAttachmentList } from "./answerAttachmentList";
import { AnswerCreatedEvent } from "../events/answerCreatedEvent";

export interface AnswerProps {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  attachments: AnswerAttachmentList;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content;
  }
  get authorId() {
    return this.props.authorId;
  }
  get questionId() {
    return this.props.questionId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get attachments() {
    return this.props.attachments;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch();
  }

  static create(props: Optional<AnswerProps, "createdAt" | 'attachments'>, id?: UniqueEntityID) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: new Date(),
      },
      id,
    );

    if(!id) answer.addDomainEvent(new AnswerCreatedEvent(answer));

    return answer;
  }
}
