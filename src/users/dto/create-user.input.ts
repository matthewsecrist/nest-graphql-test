import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../models/users.model';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'username',
] as const) {
  @Field()
  email: string;

  @Field()
  username: string;
}
