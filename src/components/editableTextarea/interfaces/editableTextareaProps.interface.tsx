export interface EditableTextareaPropsInterface {
	onChange: () => void
	onDone: () => void
	value: any
	doneText?: string
	title?: string
}