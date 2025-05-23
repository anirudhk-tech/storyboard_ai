export interface Message {
	id: string;
	content: string;
	createdAt: string;
	role: 'user' | 'ai';
}
