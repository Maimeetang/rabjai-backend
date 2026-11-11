import { IsString } from 'class-validator';
import { CategoryType } from '../../common/enums/category-type.enum.js';

export class CategoryRequestDto {
  @IsString()
  name: string;

  @IsString()
  type: CategoryType;
}
