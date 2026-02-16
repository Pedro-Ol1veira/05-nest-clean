import { Slug } from "./value-objects/slug";
import { UniqueEntityID } from "../../../../core/entities/uniqueEntityId";
import { Optional } from "../../../../core/types/optional";
import dayjs from 'dayjs';
import { AggregateRoot } from "@/core/entities/aggregateRoot";
import { QuestionAttachmentList } from "./questionAttachmentList";
import { QuestionBestAnswerChosenEvent } from "../events/questionBestAnswerChosenEvent";

export interface QuestionProps {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID;
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  get bestAnswerId() {
    return this.props.bestAnswerId;
  }
  get authorId() {
    return this.props.authorId;
  }
  get title() {
    return this.props.title;
  }
  get attachments() {
    return this.props.attachments;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get slug() {
    return this.props.slug;
  }
  get content() {
    return this.props.content;
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

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  set bestAnswerId(id: UniqueEntityID | undefined) {

    if(id === undefined) {
      return
    }
    if(this.props.bestAnswerId === undefined || this.props.bestAnswerId.equals(id)) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, id));
    }
    
    this.props.bestAnswerId = id;

    

    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {    
    this.props.attachments = attachments;
    this.touch();
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }
}
