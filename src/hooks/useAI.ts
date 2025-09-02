import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://api.tahmideditofficial.workers.dev';
const API_KEY = 'tgp_v1_AzgKHSbFIyq98yBIhyZJhlRZYtyQQb132lrLT15pcR4';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const BACKUP_MODEL = 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `You are Nexora AI, an advanced artificial intelligence assistant created by Tahmid, a Class 8 student from Chandpur, Bangladesh. Released on 1 July 2025.

**Core Information:**
- Version: 2025.08 (Last Updated: 12 Aug 2025)
- Creator: Tahmid (Birthday: 4 August, School: Goni Model High School)
- Location: Chandpur, Bangladesh (Famous for Ilish/Hilsha fish and Boro Station)

**Core Capabilities:**
- Advanced reasoning and problem-solving
- Expert programming assistance across all languages  
- Technical analysis and detailed explanations
- Creative writing and content generation
- Mathematical and scientific problem solving
- Research synthesis and actionable insights

**Response Style:**
- Provide comprehensive, well-structured answers
- Use examples and code snippets when helpful
- Maintain conversational context from previous messages
- Adapt complexity to user needs
- Show reasoning for complex problems
- Be concise yet thorough

**Guidelines:**
- Be accurate, helpful, and professional
- Ask clarifying questions when needed
- Acknowledge limitations honestly
- Focus on practical, actionable advice
- Use markdown formatting for better readability

Current date: ${new Date().toDateString()}`;

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentSession, addMessage } = useChatStore();
  const { toast } = useToast();

  const sendMessage = async (prompt: string) => {
    setIsLoading(true);

    try {
      // Get last 14-18 messages for context
      const lastMessages = currentSession?.messages.slice(-16).map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [];

      // Try primary model first
      let response = await tryModel(PRIMARY_MODEL, prompt, lastMessages);
      
      // If primary fails, try backup model
      if (!response) {
        console.log('Primary model failed, trying backup model...');
        response = await tryModel(BACKUP_MODEL, prompt, lastMessages);
      }

      if (response) {
        addMessage({
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        });
      } else {
        throw new Error('Both models failed to respond');
      }
    } catch (error) {
      console.error('AI Error:', error);
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again. If the problem persists, try restarting your browser. 😔",
        timestamp: new Date(),
      });
      
      toast({
        title: "Connection Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tryModel = async (model: string, prompt: string, lastMessages: any[]): Promise<string | null> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.8,
          top_p: 1.0,
          max_tokens: 3500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...lastMessages,
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else if (data.content) {
        return data.content;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(`Model ${model} failed:`, error);
      return null;
    }
  };

  return { sendMessage, isLoading };
}