import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { TopPageService } from './top-page.service';
import { TopPageModel } from './top-page.model';
import { HhModule } from '../hh/hh.module';

@Module({
  controllers: [TopPageController],
  imports: [
	TypegooseModule.forFeature([
		{
		typegooseClass: TopPageModel,
		schemaOptions: {
			collection: 'TopPage',
		},
		},
	]),
		HhModule
  ],
  providers: [TopPageService],
})
export class TopPageModule {}
