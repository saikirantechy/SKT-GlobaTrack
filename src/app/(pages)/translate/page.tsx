"use client";

import { useState, useRef, useEffect } from "react";
import { translate } from "@/ai/flows/translate-speech";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, Volume2, Loader2, AlertCircle, FileText, Languages } from "lucide-react";
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
  const [targetLanguage, setTargetLanguage] = useState("es");

  // Speech translation states
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranslation, setSpeechTranslation] = useState("");
  const [isSpeechTranslating, setIsSpeechTranslating] = useState(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Text translation states
  const [textToTranslate, setTextToTranslate] = useState("");
  const [textTranslation, setTextTranslation] = useState("");
  const [isTextTranslating, setIsTextTranslating] = useState(false);

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
      setSpeechTranslation("");

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsSpeechTranslating(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          try {
            const result = await translate({
              speechDataUri: base64data,
              targetLanguage: targetLanguage,
              sourceLanguage: 'auto', 
            });
            if (result.translation) {
              setSpeechTranslation(result.translation);
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
            setIsSpeechTranslating(false);
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
  
  const speakText = (text: string) => {
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLanguage;
        window.speechSynthesis.speak(utterance);
    }
  }

  const handleTextTranslate = async () => {
    if (!textToTranslate.trim()) return;
    setIsTextTranslating(true);
    setTextTranslation("");
    try {
      const result = await translate({
        text: textToTranslate,
        targetLanguage: targetLanguage,
        sourceLanguage: 'auto',
      });
      if (result.translation) {
        setTextTranslation(result.translation);
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
      setIsTextTranslating(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
       <header>
        <h1 className="text-4xl font-headline font-bold text-primary">AI Language Translator</h1>
        <p className="text-muted-foreground font-body text-lg">Speak or type to get instant translations. Powered by AI.</p>
      </header>

      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Real-time Translation</CardTitle>
          <CardDescription>Select a target language and use either speech or text input.</CardDescription>
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

          <Tabs defaultValue="speech" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="speech"><Mic className="mr-2 h-4 w-4" /> Speech</TabsTrigger>
              <TabsTrigger value="text"><FileText className="mr-2 h-4 w-4" /> Text</TabsTrigger>
            </TabsList>
            <TabsContent value="speech" className="mt-6">
              <div className="flex flex-col items-center gap-4">
                {micPermission === false && (
                  <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-md w-full">
                      <AlertCircle className="h-5 w-5" />
                      <p>Microphone access is required. Please enable it in your browser settings.</p>
                  </div>
                )}

                <Button onClick={handleRecordClick} size="icon" className="w-24 h-24 rounded-full" disabled={micPermission === false}>
                  {isSpeechTranslating ? (
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
                
                {speechTranslation && (
                  <Card className="w-full bg-accent/20">
                      <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                              <p className="text-lg font-semibold font-body text-accent-foreground">{speechTranslation}</p>
                              <Button variant="ghost" size="icon" onClick={() => speakText(speechTranslation)}>
                                  <Volume2 className="h-5 w-5 text-accent-foreground"/>
                              </Button>
                          </div>
                      </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-6">
              <div className="flex flex-col gap-4">
                <Textarea 
                  placeholder="Type or paste text here to translate..."
                  value={textToTranslate}
                  onChange={(e) => setTextToTranslate(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button onClick={handleTextTranslate} disabled={isTextTranslating}>
                  {isTextTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                  Translate Text
                </Button>

                {textTranslation && (
                  <Card className="w-full bg-accent/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold font-body text-accent-foreground">{textTranslation}</p>
                        <Button variant="ghost" size="icon" onClick={() => speakText(textTranslation)}>
                            <Volume2 className="h-5 w-5 text-accent-foreground"/>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
