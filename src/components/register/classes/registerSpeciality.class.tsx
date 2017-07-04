import RegisterSpecialityInterface from '../interfaces/registerSpeciality.interface';

class RegisterSpeciality implements RegisterSpecialityInterface {
	professions: any[];
	data: {
		profession: string
		location: {
			latitude: number
			longitude: number
		},
		zipCode: string
		professionSpecialInfo: string
		subProfessions: any[]
	};
	showManualZip: boolean;
	coordinatesRetrieved: boolean;
	availableZipsUpdated: boolean;
	availableZips: any[];

	constructor() {
		this.professions = [];
		this.data        = {
			profession: '',
			location:   {
				latitude:  0,
				longitude: 0
			},
			zipCode: '',
			professionSpecialInfo: '',
			subProfessions: []
		};
		this.showManualZip = false;
		this.coordinatesRetrieved = false;
		this.availableZips = [];
		this.availableZipsUpdated = false;
	}
}

export default RegisterSpeciality;