import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/users.model';

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

  @Field(() => User)
  author: User;
}
