import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
	}

	async create(dto: CreateTopPageDto) {
		return this.topPageModel.create(dto);
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate()
			.match({
				firstCategory,
			})
			.group({
				_id: {
					secondCategory: '$secondCategory',
				},
				pages: {
					$push: {
						alias: '$alias',
						title: '$title',
					},
				},
			})
			// 	.aggregate([
			// 	{
			// 		$match: {
			// 			firstCategory,
			// 		},
			// 	},
			// 	{
			// 		$group: {
			// 			_id: {
			// 				secondCategory: '$secondCategory'
			// 			},
			// 			pages: {
			// 				$push: {
			// 					alias: '$alias',
			// 					title: '$title'
			// 				}
			// 			}
			// 		}
			// 	},
			// ])
			.exec();
	}

	async findByText(text: string) {
		return this.topPageModel.find({
			$text: {                    // поиск по тексту среди индексированных полей
				$search: text,            // то что мы ищем
				$caseSensitive: false,    // неважен case текста заглавный или строчный
			},
		}).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateTopPageDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec();
	}


}
