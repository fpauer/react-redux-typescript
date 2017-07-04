export interface ProfileHoursStateInterface {
	workingHours: any,
	isEditing: string
}

export interface WorkingDayHoursInterface {
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
}