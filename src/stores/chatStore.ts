import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  
  // Actions
  createNewSession: () => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  clearAllChats: () => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatSessions: [],
      currentSessionId: null,
      currentSession: null,

      createNewSession: () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('chatStore: Creating new session with ID:', sessionId);
        
        const newSession: ChatSession = {
          id: sessionId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => {
          console.log('chatStore: Adding new session to store, total sessions will be:', state.chatSessions.length + 1);
          return {
            chatSessions: [newSession, ...state.chatSessions],
            currentSessionId: sessionId,
            currentSession: newSession,
          };
        });
      },

      switchSession: (sessionId: string) => {
        const session = get().chatSessions.find(s => s.id === sessionId);
        if (session) {
          set({
            currentSessionId: sessionId,
            currentSession: session,
          });
        }
      },

      deleteSession: (sessionId: string) => {
        const state = get();
        const updatedSessions = state.chatSessions.filter(s => s.id !== sessionId);
        
        let newCurrentSessionId = state.currentSessionId;
        let newCurrentSession = state.currentSession;

        // If we're deleting the current session, switch to another one
        if (state.currentSessionId === sessionId) {
          if (updatedSessions.length > 0) {
            newCurrentSessionId = updatedSessions[0].id;
            newCurrentSession = updatedSessions[0];
          } else {
            newCurrentSessionId = null;
            newCurrentSession = null;
          }
        }

        set({
          chatSessions: updatedSessions,
          currentSessionId: newCurrentSessionId,
          currentSession: newCurrentSession,
        });
      },

      addMessage: (message: Omit<Message, 'id'>) => {
        const state = get();
        console.log('chatStore: Adding message:', { role: message.role, contentLength: message.content.length });
        
        if (!state.currentSession) {
          console.log('chatStore: No current session, creating new one');
          get().createNewSession();
        }

        const currentSession = get().currentSession;
        if (!currentSession) {
          console.error('chatStore: Failed to get current session after creation');
          return;
        }

        const updatedSession: ChatSession = {
          ...currentSession,
          messages: [...currentSession.messages, message],
          updatedAt: new Date(),
          // Auto-generate title from first user message if not set
          title: currentSession.title || (
            message.role === 'user' && currentSession.messages.length === 0
              ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
              : currentSession.title
          ),
        };

        console.log('chatStore: Updated session will have messages:', updatedSession.messages.length);

        set((state) => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === currentSession.id ? updatedSession : session
          ),
          currentSession: updatedSession,
        }));
      },

      clearAllChats: () => {
        set({
          chatSessions: [],
          currentSessionId: null,
          currentSession: null,
        });
      },

      updateSessionTitle: (sessionId: string, title: string) => {
        set((state) => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId ? { ...session, title, updatedAt: new Date() } : session
          ),
          currentSession: state.currentSession?.id === sessionId 
            ? { ...state.currentSession, title, updatedAt: new Date() } 
            : state.currentSession,
        }));
      },
    }),
    {
      name: 'nexora-chat-store',
      // Convert dates back from JSON
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.chatSessions = state.chatSessions.map(session => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
          
          if (state.currentSession) {
            state.currentSession = {
              ...state.currentSession,
              createdAt: new Date(state.currentSession.createdAt),
              updatedAt: new Date(state.currentSession.updatedAt),
              messages: state.currentSession.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            };
          }
        }
      },
    }
  )
);