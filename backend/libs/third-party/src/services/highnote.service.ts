import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export interface HighNoteConfig {
  apiKey: string;
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

export interface HighNoteUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface HighNoteCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: 'active' | 'inactive' | 'blocked';
  balance: number;
  currency: string;
}

@Injectable()
export class HighNoteService {
  private readonly client: AxiosInstance;

  constructor(private readonly config: HighNoteConfig) {
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createUser(userData: Omit<HighNoteUser, 'id'>): Promise<HighNoteUser> {
    try {
      const response = await this.client.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create HighNote user: ${error.message}`);
    }
  }

  async getUser(userId: string): Promise<HighNoteUser> {
    try {
      const response = await this.client.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get HighNote user: ${error.message}`);
    }
  }

  async updateUser(userId: string, userData: Partial<HighNoteUser>): Promise<HighNoteUser> {
    try {
      const response = await this.client.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update HighNote user: ${error.message}`);
    }
  }

  async createCard(userId: string, cardData: Omit<HighNoteCard, 'id' | 'userId'>): Promise<HighNoteCard> {
    try {
      const response = await this.client.post('/cards', {
        ...cardData,
        userId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create HighNote card: ${error.message}`);
    }
  }

  async getCard(cardId: string): Promise<HighNoteCard> {
    try {
      const response = await this.client.get(`/cards/${cardId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get HighNote card: ${error.message}`);
    }
  }

  async getUserCards(userId: string): Promise<HighNoteCard[]> {
    try {
      const response = await this.client.get(`/users/${userId}/cards`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user cards: ${error.message}`);
    }
  }

  async blockCard(cardId: string): Promise<HighNoteCard> {
    try {
      const response = await this.client.post(`/cards/${cardId}/block`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to block card: ${error.message}`);
    }
  }

  async unblockCard(cardId: string): Promise<HighNoteCard> {
    try {
      const response = await this.client.post(`/cards/${cardId}/unblock`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to unblock card: ${error.message}`);
    }
  }

  async getCardBalance(cardId: string): Promise<{ balance: number; currency: string }> {
    try {
      const response = await this.client.get(`/cards/${cardId}/balance`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get card balance: ${error.message}`);
    }
  }
}
