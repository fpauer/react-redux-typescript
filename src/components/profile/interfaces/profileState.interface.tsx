export interface ProfileStateInterface {
	errors: any[]
	messages: any[]
	inflight: boolean
	photosUploaded: boolean
	nextInfoStep: boolean
	availableLanguages?: any[]
	availableZipsUpdated: boolean
	availableZips?: any[]
	billing?: any
}