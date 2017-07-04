export interface CustomTimeInputPropsInterface {
	target: {
		hours: any,
		minutes: any,
		seconds: any
	},
	noSeconds?: boolean,
	onChange: (key, value) => void
}