/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/api' {
  import type { Question, Block, Presentation, Person, Conference, Announcement } from '@/types/api';
  
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
}

declare module '@/composables/useVuexStore.js' {
  import { Store } from 'vuex';
  
  interface CustomStore extends Store<any> {
    login(token: string): void;
  }
  
  export function useStore(): CustomStore;
} 