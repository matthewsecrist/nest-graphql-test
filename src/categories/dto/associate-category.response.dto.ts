import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AssociateCategoryResponseDTO {
  @Field(() => Boolean)
  isSuccess: boolean;
}
