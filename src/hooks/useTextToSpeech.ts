import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speak = async (text: string) => {
    try {
      setIsLoading(true);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
      }

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_v3',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Error", 
        description: "Failed to convert text to speech. Please check your ElevenLabs API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
  };
}