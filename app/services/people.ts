import type { Person, CreatePersonDto, UpdatePersonDto } from '../types/person';

const API_BASE = 'https://familychores-frontend-production.up.railway.app/api';

export class PersonService {
  static async getAllPeople(): Promise<Person[]> {
    console.log('PersonService: Fetching all people');
    const response = await fetch(`${API_BASE}/people`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch people: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('PersonService: People fetched successfully', data);

    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.error || 'Failed to fetch people');
    }
  }

  static async createPerson(personData: CreatePersonDto): Promise<Person> {
    console.log('PersonService: Creating person', personData);
    const response = await fetch(`${API_BASE}/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create person: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('PersonService: Person created successfully', data);

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to create person');
    }
  }

  static async updatePerson(personData: UpdatePersonDto): Promise<Person> {
    console.log('PersonService: Updating person', personData);
    const response = await fetch(`${API_BASE}/people/${personData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update person: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('PersonService: Person updated successfully', data);

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to update person');
    }
  }

  static async deletePerson(id: string): Promise<void> {
    console.log('PersonService: Deleting person', id);
    const response = await fetch(`${API_BASE}/people/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete person: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('PersonService: Person deleted successfully', data);

    if (!data.success) {
      throw new Error(data.error || 'Failed to delete person');
    }
  }
}
