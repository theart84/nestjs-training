import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_URL, CLUSTER_FIND_ERROR, SALARY_CLUSTER_ID } from './hh.constants';
import { HhResponse } from './hh.models';
import { HhData } from '../top-page/top-page.model';

@Injectable()
export class HhService {
	token: string;

	constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
		this.token = configService.get('HH_TOKEN') ?? '';
	}

	async getData(text: string) {
		try {
			// @ts-ignore
			const { data } = await this.httpService.get<HhResponse>(API_URL.vacancies, {
				params: {
					text,
					cluster: true,
				},
				headers: {
					'User-Agent': 'OwlTop/1.0(art@gmail.com)',
					'Authorization': 'Bearer ' + this.token,
				},
			}).toPromise();
			return this.parseData(data);
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HhResponse): HhData {
		const salaryCluster = data.clusters.find(c => c.id === SALARY_CLUSTER_ID);
		if (!salaryCluster) {
			throw new Error(CLUSTER_FIND_ERROR);
		}
		return {
			counter: data.found,
			juniorSalary: this.getSalaryFromString(salaryCluster.items[1].name),
			middleSalary: this.getSalaryFromString(salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name),
			seniorSalary: this.getSalaryFromString(salaryCluster.items[salaryCluster.items.length - 1].name),
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(s: string): number {
		const numberRexEx = /(\d+)/g;
		const result = s.match(numberRexEx);
		if (!result) {
			return 0;
		}
		return Number(result[0]);
	}
}
