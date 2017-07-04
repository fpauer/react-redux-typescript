import {Action} from 'redux';

export interface ProfileAction extends Action {
	errors?: string[]
	data?: any
}