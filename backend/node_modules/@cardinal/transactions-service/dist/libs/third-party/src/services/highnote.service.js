"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighNoteService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let HighNoteService = class HighNoteService {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: this.config.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async createUser(userData) {
        try {
            const response = await this.client.post('/users', userData);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create HighNote user: ${error.message}`);
        }
    }
    async getUser(userId) {
        try {
            const response = await this.client.get(`/users/${userId}`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get HighNote user: ${error.message}`);
        }
    }
    async updateUser(userId, userData) {
        try {
            const response = await this.client.put(`/users/${userId}`, userData);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to update HighNote user: ${error.message}`);
        }
    }
    async createCard(userId, cardData) {
        try {
            const response = await this.client.post('/cards', {
                ...cardData,
                userId,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create HighNote card: ${error.message}`);
        }
    }
    async getCard(cardId) {
        try {
            const response = await this.client.get(`/cards/${cardId}`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get HighNote card: ${error.message}`);
        }
    }
    async getUserCards(userId) {
        try {
            const response = await this.client.get(`/users/${userId}/cards`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get user cards: ${error.message}`);
        }
    }
    async blockCard(cardId) {
        try {
            const response = await this.client.post(`/cards/${cardId}/block`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to block card: ${error.message}`);
        }
    }
    async unblockCard(cardId) {
        try {
            const response = await this.client.post(`/cards/${cardId}/unblock`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to unblock card: ${error.message}`);
        }
    }
    async getCardBalance(cardId) {
        try {
            const response = await this.client.get(`/cards/${cardId}/balance`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get card balance: ${error.message}`);
        }
    }
};
exports.HighNoteService = HighNoteService;
exports.HighNoteService = HighNoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], HighNoteService);
//# sourceMappingURL=highnote.service.js.map