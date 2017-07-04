interface RegisterSpeciality {
	professions: any[]
	data: {
		profession: string
		location: {
			latitude: number
			longitude: number
		},
		zipCode: string,
		professionSpecialInfo: string
		subProfessions: any[]
	},
	showManualZip: boolean
	coordinatesRetrieved: boolean
	availableZipsUpdated: boolean
	availableZips: any[]
}

export default RegisterSpeciality;