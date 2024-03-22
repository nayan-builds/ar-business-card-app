import {API_BASE_URL} from '@env';
import axios from 'axios';

//if API_BASE_URL is not being loaded from your .env, making any change to this file
//will force a reload of the app and the new .env file will be loaded

export const API_URL = API_BASE_URL;

export class IWorkHistory {
  company: string = '';
  position: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  description: string = '';
}

export interface IQualification {
  level: string;
  name: string;
  grade: string;
}

export class IEducationHistory {
  institution: string = '';
  qualifications: IQualification[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  description: string = '';
}

export interface IContactDetails {
  email?: string;
  linkedIn?: string;
  phone?: string;
}

export interface IUserDetails {
  firstName?: string;
  lastName?: string;
  overview?: string;
  workHistory?: IWorkHistory[];
  educationHistory?: IEducationHistory[];
  interests?: string[];
  contact?: IContactDetails;
}

export const getUser = async (id: string) => {
  return await (
    await fetch(`${API_URL}/api/user/${id}`, {
      method: 'GET',
    })
  ).json();
};

export const getThisUser = async () => {
  console.log(API_URL);

  return await (
    await axios.get(`${API_URL}/api/user/`)
  ).data;
};

export const updateUser = async (user: IUserDetails) => {
  return await (
    await axios.patch(`${API_URL}/api/user/`, user)
  ).data;
};
