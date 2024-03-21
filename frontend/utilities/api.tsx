const BASE_URL = 'https://3094-82-32-220-251.ngrok-free.app';

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
    await fetch(`${BASE_URL}/api/user/${id}`, {
      method: 'GET',
    })
  ).json();
};

export const updateUser = async (id: string, user: IUserDetails) => {
  console.log(user);

  return await (
    await fetch(`${BASE_URL}/api/user/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user),
    })
  ).json();
};
