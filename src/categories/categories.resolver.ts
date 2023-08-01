import { CategoriesService } from '@app/categories';
import { NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { Category } from 'src/models/categories.model';
import { Post } from 'src/models/post.model';
import { AssociateCategoryResponseDTO } from './dto/associate-category.response.dto';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: 'categories' })
  async categories() {
    return await this.categoriesService.list();
  }

  @Query(() => Category)
  async category(
    @Args('categoryId', { type: () => String }) categoryId: string,
  ) {
    const category = await this.categoriesService.fetchById(categoryId);

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  @ResolveField('posts', () => [Post])
  async posts(@Parent() category: Category) {
    return await this.categoriesService.fetchPostsByCategoryId(category.id);
  }

  @Mutation(() => AssociateCategoryResponseDTO)
  async associateCategoryResponse(
    @Args('categoryId', { type: () => String }) categoryId: string,
    @Args('postId', { type: () => String }) postId: string,
  ) {
    try {
      await this.categoriesService.associatePost(categoryId, postId);
      return {
        isSuccess: true,
      };
    } catch (err) {
      return {
        isSuccess: false,
      };
    }
  }

  @Mutation(() => Category)
  async createCategory(@Args('name', { type: () => String }) name: string) {
    return await this.categoriesService.create(name);
  }
}
