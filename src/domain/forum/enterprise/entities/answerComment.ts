import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Optional } from "@/core/types/optional";
import { Comments, CommentsProps } from "./comment";

export interface AnswerCommentsProps extends CommentsProps {
  answerId: UniqueEntityID;
}

export class AnswerComments extends Comments<AnswerCommentsProps> {

  get answerId() {
    return this.props.answerId;
  }

  static create(props: Optional<AnswerCommentsProps, "createdAt">, id?: UniqueEntityID) {
    const answersComment = new AnswerComments(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return answersComment;
  }
}
