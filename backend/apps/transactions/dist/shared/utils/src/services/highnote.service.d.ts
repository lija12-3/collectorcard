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
export declare class HighNoteService {
    private readonly config;
    private readonly client;
    constructor(config: HighNoteConfig);
    createUser(userData: Omit<HighNoteUser, 'id'>): Promise<HighNoteUser>;
    getUser(userId: string): Promise<HighNoteUser>;
    updateUser(userId: string, userData: Partial<HighNoteUser>): Promise<HighNoteUser>;
    createCard(userId: string, cardData: Omit<HighNoteCard, 'id' | 'userId'>): Promise<HighNoteCard>;
    getCard(cardId: string): Promise<HighNoteCard>;
    getUserCards(userId: string): Promise<HighNoteCard[]>;
    blockCard(cardId: string): Promise<HighNoteCard>;
    unblockCard(cardId: string): Promise<HighNoteCard>;
    getCardBalance(cardId: string): Promise<{
        balance: number;
        currency: string;
    }>;
}
