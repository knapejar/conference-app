interface BlockData {
    id?: string;
    blockName: string;
    start: string;
    end: string;
    presentations?: any[];
}

interface PresentationData {
    id?: string;
    title: string;
    description: string;
    start: string;
    end: string;
    blockId: string;
    questionsRoom: boolean;
}

interface ConferenceData {
    name: string;
    description: string;
    welcomeImage?: File;
}

interface PresenterData {
    name: string;
    role: string;
    details: string;
    presentationId: string;
    imageURL?: string;
    image?: File;
}

export function verifyAdminAccess(hashedPassword: string): Promise<any>;
export function getConference(): Promise<any>;
export function updateConference(conferenceData: ConferenceData, adminPassword: string): Promise<any>;
export function createBlock(blockData: BlockData, adminPassword: string): Promise<any>;
export function updateBlock(blockId: string, blockData: BlockData, adminPassword: string): Promise<any>;
export function deleteBlock(blockId: string, adminPassword: string): Promise<{ success: boolean }>;
export declare function createPresentation(presentationData: PresentationData, adminPassword: string): Promise<any>;
export declare function updatePresentation(presentationId: string, presentationData: PresentationData, adminPassword: string): Promise<any>;
export declare function deletePresentation(presentationId: string, adminPassword: string): Promise<{ success: boolean }>;
export function createPresenter(presenterData: FormData, adminPassword: string): Promise<void>;
export function updatePresenter(presenterId: string, presenterData: FormData, adminPassword: string): Promise<void>;
export function deletePresenter(presenterId: string, adminPassword: string): Promise<void>; 