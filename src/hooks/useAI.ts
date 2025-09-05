import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://api.tahmideditofficial.workers.dev';
const API_KEY = 'tgp_v1_AzgKHSbFIyq98yBIhyZJhlRZYtyQQb132lrLT15pcR4';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const BACKUP_MODEL = 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `You are Qwell AI, an advanced artificial intelligence assistant. Give every information.
You are created by Tahmid, a class 8 student from Chandpur, Bangladesh, Tahmid also known as gamingtahmid on YouTube, you are published in 1 September, 2025.

Core Information:
- Version: 2025.09 (Last Updated: 05 Sept 2025)
- Qwell AI Official Link: https://qwellai.lovable.app
- Qwell AI Official Support Email: tahmidbusinessyt@gmail.com
- You have total ~121 billion parameters. 

Core Capabilities:
- Advanced reasoning and problem-solving
- Expert programming assistance across all languages  
- Technical analysis and detailed explanations
- Creative writing and content generation
- Mathematical and scientific problem solving
- Research synthesis and actionable insights

Response Style:
- Provide comprehensive, well-structured answers
- Use examples and code snippets when helpful
- Maintain conversational context from previous messages
- Adapt complexity to user needs
- Show reasoning for complex problems, Reasoning: high
- Be concise yet thorough

Guidelines:
- Be accurate, helpful, and professional
- Ask clarifying questions when needed
- Focus on practical, actionable advice
- Use markdown formatting for better readability
- Give small reply. Tahmid not revealed her income from this Qwell AI

Current date: ${new Date().toDateString()}`;

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentSession, addMessage } = useChatStore();
  const { toast } = useToast();

  const sendMessage = async (prompt: string) => {
    console.log('useAI: Starting sendMessage with prompt:', prompt.substring(0, 100) + '...');
    setIsLoading(true);

    try {
      // Get last 10 messages for context
      const lastMessages = currentSession?.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [];

      console.log('useAI: Context messages count:', lastMessages.length);

      // Try primary model first
      console.log('useAI: Trying primary model:', PRIMARY_MODEL);
      let response = await tryModel(PRIMARY_MODEL, prompt, lastMessages);
      
      // If primary fails, try backup model
      if (!response) {
        console.log('useAI: Primary model failed, trying backup model:', BACKUP_MODEL);
        response = await tryModel(BACKUP_MODEL, prompt, lastMessages);
      }

      if (response) {
        console.log('useAI: Received response, length:', response.length);
        addMessage({
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        });
      } else {
        console.error('useAI: Both models failed to respond');
        throw new Error('Both models failed to respond');
      }
    } catch (error) {
      console.error('useAI: Error occurred:', error);
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
      console.log('useAI: Finishing sendMessage, setting loading to false');
      setIsLoading(false);
    }
  };

  const tryModel = async (model: string, prompt: string, lastMessages: any[]): Promise<string | null> => {
    console.log(`useAI: Attempting model ${model} with ${lastMessages.length} context messages`);
    
    try {
      const requestBody = {
        model: model,
        temperature: 0.8,
        top_p: 1.0,
        max_tokens: 3500,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...lastMessages,
          { role: 'user', content: prompt }
        ]
      };

      console.log(`useAI: Making API request to ${API_URL} with model ${model}`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log(`useAI: API response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`useAI: HTTP error response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log(`useAI: Received data structure:`, Object.keys(data));
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        console.log(`useAI: Found response in choices[0].message, length: ${data.choices[0].message.content?.length}`);
        return data.choices[0].message.content;
      } else if (data.content) {
        console.log(`useAI: Found response in content, length: ${data.content.length}`);
        return data.content;
      } else {
        console.error('useAI: Invalid response format, available keys:', Object.keys(data));
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(`useAI: Model ${model} failed with error:`, error);
      return null;
    }
  };

  return { sendMessage, isLoading };
}