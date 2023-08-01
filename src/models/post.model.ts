import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './users.model';
import { Category } from './categories.model';
import { Subscription } from './subscriptions.model';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  body: string;

  @Field()
  published: boolean;

  @Field()
  votes: number;

  @Field()
  authorId: string;

  @Field(() => User)
  author: User;

  @Field(() => [Category])
  categories: Category[];

  @Field(() => [Subscription])
  subscriptions: Subscription[];
}
