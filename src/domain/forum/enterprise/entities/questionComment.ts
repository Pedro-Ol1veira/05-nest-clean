import { UniqueEntityID } from "@/core/entities/uniqueEntityId";
import { Optional } from "@/core/types/optional";
import { Comments, CommentsProps } from "./comment";

export interface QuestionCommentsProps extends CommentsProps {
  questionId: UniqueEntityID;
}

export class QuestionComments extends Comments<QuestionCommentsProps> {

  get questionId() {
    return this.props.questionId;
  }

  static create(props: Optional<QuestionCommentsProps, "createdAt">, id?: UniqueEntityID) {
    const questionComments = new QuestionComments(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return questionComments;
  }
}
