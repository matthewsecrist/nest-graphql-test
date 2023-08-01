import { CategoriesService } from '@app/categories';
import { Module } from '@nestjs/common';
import { CategoriesResolver } from './categories.resolver';

@Module({
  controllers: [],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
