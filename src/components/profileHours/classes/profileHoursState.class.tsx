import {ProfileHoursStateInterface} from '../interfaces/profileHoursState.interface';
import {WorkingDayHoursInterface} from '../interfaces/profileHoursState.interface';
import Config from '../../app/app.config';
import * as _ from 'underscore';

export class ProfileHoursStateClass implements ProfileHoursStateInterface {
	workingHours: any;
	isEditing: string;

	constructor() {
		this.isEditing = '';
		this.workingHours = {};

		_.each(Config.weekDays, (day: string) => {
			this.workingHours = _.extend(this.workingHours, new WorkingDayHoursClass(day));
		});
	}
}

export class WorkingDayHoursClass implements WorkingDayHoursInterface {
	[key: string]: {
		from: {
			hours: any,
			minutes: any
		},
		to: {
			hours: any,
			minutes: any
		},
		closed: boolean
	}

	constructor(key: string) {
		this[key] = {
			from: {
				hours: '00',
				minutes: '00'
			},
			to: {
				hours: '00',
				minutes: '00'
			},
			closed: true
		}
	}
}