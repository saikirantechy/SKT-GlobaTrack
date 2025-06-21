"use client";

import { useState, useRef, useEffect } from "react";
import { translateSpeech } from "@/ai/flows/translate-speech";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Volume2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "mr", label: "Marathi"},
  { value: "ta", label: "Tamil"},
  { value: "te", label: "Telugu"},
];

export default function TranslatePage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [translation, setTranslation] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
      setMicPermission(permissionStatus.state === 'granted');
      permissionStatus.onchange = () => {
        setMicPermission(permissionStatus.state === 'granted');
      };
    });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      setIsRecording(true);
      setTranslation("");
      setOriginalText("");

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          try {
            // Note: `spokenLanguage` is auto-detected by the underlying model,
            // so we can pass a generic value or the target language itself.
            // For better accuracy, one might use a speech-to-text model first
            // to identify the language, but this is sufficient for this demo.
            const result = await translateSpeech({
              speechDataUri: base64data,
              targetLanguage: targetLanguage,
              spokenLanguage: 'auto', 
            });
            if (result.translation) {
              setTranslation(result.translation);
            } else {
              toast({
                variant: "destructive",
                title: "Translation Failed",
                description: "Could not get a translation. Please try again.",
              });
            }
          } catch (error) {
            console.error(error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "An error occurred during translation.",
            });
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      setMicPermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop the media stream tracks to turn off the mic indicator
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const speakTranslation = () => {
    if (translation) {
        const utterance = new SpeechSynthesisUtterance(translation);
        utterance.lang = targetLanguage;
        window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div className="flex flex-col gap-8">
       <header>
        <h1 className="text-4xl font-headline font-bold text-primary">AI Language Translator</h1>
        <p className="text-muted-foreground font-body text-lg">Speak and get instant translations. Powered by AI.</p>
      </header>

      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Real-time Translation</CardTitle>
          <CardDescription>Select a language, then press the mic to start speaking.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full max-w-xs">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {micPermission === false && (
            <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <p>Microphone access is required. Please enable it in your browser settings.</p>
            </div>
          )}

          <Button onClick={handleRecordClick} size="icon" className="w-24 h-24 rounded-full" disabled={micPermission === false}>
            {isLoading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isRecording ? "Recording... Click to stop." : "Tap to start recording."}
          </p>
          
          {translation && (
            <Card className="w-full bg-accent/20">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold font-body text-accent-foreground">{translation}</p>
                        <Button variant="ghost" size="icon" onClick={speakTranslation}>
                            <Volume2 className="h-5 w-5 text-accent-foreground"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
