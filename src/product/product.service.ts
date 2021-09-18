import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model';

@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {
	}

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}

	async findById(id: string) {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return await this.productModel.aggregate([
			{
				$match: {
					categories: dto.category,
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$limit: dto.limit,
			},
			{
				$lookup: {              			  // подтягивает одну табличку к другой
					from: 'Review',       			  // из какой коллекции подтянуть данные
					localField: '_id', 				    // искать по id
					foreignField: 'productId',    // поле в котором мы будем искать
					as: 'reviews',                 // поле которые будет выведено в результате
				},
			},
			{
				$addFields: {
					reviewCount: { $size: '$reviews' }, // добавляем новые поля
					reviewAvg: { $avg: '$reviews.rating' }, // добавляем новое поле и высчитываем средний рейтинг
				},
			}, // нужно кастануть тип "as" потому что по умолчанию агрегации выводят тип Aggregation<any[]>
		]).exec() as (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];
	}
}