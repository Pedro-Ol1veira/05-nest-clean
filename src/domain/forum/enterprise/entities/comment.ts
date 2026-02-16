import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Optional } from "@/core/types/optional";

export interface CommentsProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comments<Props extends CommentsProps> extends Entity<Props> {
  get content() {
    return this.props.content;
  }
  get authorId() {
    return this.props.authorId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

}
