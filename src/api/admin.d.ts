interface BlockData {
    id?: string;
    blockName: string;
    start: string;
    end: string;
    presentations?: any[];
}

interface ConferenceData {
    name: string;
    description: string;
    welcomeImage?: File;
}

export function verifyAdminAccess(hashedPassword: string): Promise<any>;
export function getConference(): Promise<any>;
export function updateConference(conferenceData: ConferenceData, adminPassword: string): Promise<any>;
export function createBlock(blockData: BlockData, adminPassword: string): Promise<any>;
export function updateBlock(blockId: string, blockData: BlockData, adminPassword: string): Promise<any>;
export function deleteBlock(blockId: string, adminPassword: string): Promise<any>; 