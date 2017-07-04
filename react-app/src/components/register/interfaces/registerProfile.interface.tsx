export interface RegisterProfileData {
	email: string
	password: string
	firstName: string
	lastName: string
	address: string
	addressDetails: string
	phone: any
	cityData: any
}

export interface RegisterProfile {
	hasPlaces: boolean
	emailAvailable: boolean
	data: RegisterProfileData
	partialUserCreated: boolean
}