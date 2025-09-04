import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const speak = async (text: string) => {
    try {
      setIsLoading(true);

      // Check if speech synthesis is supported
      if (!('speechSynthesis' in window)) {
        throw new Error('Speech synthesis not supported');
      }

      // Stop any currently playing speech
      if (speechRef.current) {
        speechSynthesis.cancel();
        setIsPlaying(false);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;

      // Configure voice settings
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to use a Google voice if available
      const voices = speechSynthesis.getVoices();
      const googleVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Chrome')
      );
      if (googleVoice) {
        utterance.voice = googleVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        speechRef.current = null;
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        speechRef.current = null;
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Error", 
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const stop = () => {
    if (speechRef.current) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      speechRef.current = null;
    }
  };

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
  };
}