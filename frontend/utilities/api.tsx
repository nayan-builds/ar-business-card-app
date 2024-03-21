import {API_URL} from '@env';
import axios from 'axios';

export interface IWorkHistory {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export interface IQualification {
  level: string;
  name: string;
  grade: string;
}

export interface IEducationHistory {
  institution: string;
  qualifications: IQualification[];
  startDate: Date;
  endDate: Date;
  description: string;
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
  return await (
    await axios.get(`${API_URL}/api/user/`)
  ).data;
};

export const updateUser = async (user: IUserDetails) => {
  return await (
    await fetch(`${API_URL}/api/user/`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user),
    })
  ).json();
};
