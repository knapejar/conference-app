export interface Question {
  id: string;
  presentationId: string;
  content: string;
  author: string;
  authorToken: string;
  likes: number;
  createdAt: string;
}

export interface Block {
  id: string;
  blockName: string;
  presentations: Presentation[];
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  blockId: string;
  presenterId: string;
  block?: {
    blockName: string;
  };
}

export interface Person {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  presentationId?: string;
  presentation?: {
    title: string;
    start: string;
    end: string;
    block: {
      blockName: string;
    };
  };
}

export interface Conference {
  name: string;
  description: string;
  welcomeImage: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
} 