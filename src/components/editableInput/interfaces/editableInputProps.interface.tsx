export interface EditableInputPropsInterface {
	onChange: () => void
	onDone: () => void
	value: any
	doneText?: string
	title?: string
	type?: string
}