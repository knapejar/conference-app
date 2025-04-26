/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/api' {
  export function init(): Promise<void>;
  export function getQuestions(presentationId: string): Promise<Question[]>;
  export function createQuestion(presentationId: string, content: string, author?: string, authorToken?: string): Promise<Question>;
  export function likeQuestion(questionId: string): Promise<Question>;
  export function unlikeQuestion(questionId: string): Promise<Question>;
  export function deleteQuestion(questionId: string, authorToken: string): Promise<void>;
  export function getPresentations(): Promise<Block[]>;
  export function getAnnouncements(): Promise<Announcement[]>;
  export function getPeople(): Promise<Person[]>;
  export function getConference(): Promise<Conference>;
  export function getDebugToken(): Promise<string>;
  export function getInitialUpdate(deviceToken: string): Promise<{
    announcements: any[];
    blocks: any[];
    conference: any;
    presenters: any[];
  }>;

  interface Question {
    id: string;
    presentationId: string;
    content: string;
    author: string;
    authorToken: string;
    likes: number;
    createdAt: string;
  }

  interface Block {
    id: string;
    blockName: string;
    presentations: Presentation[];
  }

  interface Presentation {
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

  interface Person {
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

  interface Conference {
    name: string;
    description: string;
    welcomeImage: string;
  }

  interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }
}

declare module '@/composables/useVuexStore.js' {
  import { Store } from 'vuex';
  
  interface CustomStore extends Store<any> {
    login(token: string): void;
  }
  
  export function useStore(): CustomStore;
} 