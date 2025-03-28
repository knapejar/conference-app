export function validateInviteCode(inviteCode: string): Promise<boolean>;
export function createUserWithDeviceToken(inviteCode: string): Promise<{ deviceToken: string }>;
export function getInitialUpdate(deviceToken: string): Promise<{
    announcements: any[];
    blocks: any[];
    conference: {
        id: number;
        name: string;
        description: string;
        welcomeImage: string;
    };
    presenters: any[];
}>;
export function requestQuestions(presentationId: string): Promise<any[]>;
export function postQuestion(question: any): void;
export function onNewQuestion(callback: (question: any) => void): void;
export function likeQuestion(questionId: string): void; 