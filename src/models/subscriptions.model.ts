import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class Subscription {
  @Field(() => ID)
  id: string;

  @Field()
  foo: string;

  @Field(() => [Post])
  posts: Post[];
}
