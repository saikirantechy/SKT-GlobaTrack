"use client"

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { suggestPeopleToMeet, SuggestPeopleToMeetOutput } from "@/ai/flows/suggest-people-to-meet";
import { generateSessionSummary, GenerateSessionSummaryOutput } from "@/ai/flows/generate-session-summaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, FileText, Wand2, Lightbulb } from "lucide-react";

type PeopleFormInputs = {
  origin: string;
  language: string;
  interests: string;
};

type SummaryFormInputs = {
  transcript: string;
};

export default function EngagementPage() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<SuggestPeopleToMeetOutput['suggestions']>([]);
  const [summary, setSummary] = useState<string>("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const peopleForm = useForm<PeopleFormInputs>();
  const summaryForm = useForm<SummaryFormInputs>();

  const onSuggestSubmit: SubmitHandler<PeopleFormInputs> = async (data) => {
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const result = await suggestPeopleToMeet(data);
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
        toast({
          variant: "destructive",
          title: "Suggestion Failed",
          description: "Could not get suggestions. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while getting suggestions.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSummarizeSubmit: SubmitHandler<SummaryFormInputs> = async (data) => {
    setIsSummarizing(true);
    setSummary("");
    try {
      const result = await generateSessionSummary(data);
      if (result && result.summary) {
        setSummary(result.summary);
      } else {
        toast({
          variant: "destructive",
          title: "Summarization Failed",
          description: "Could not get a summary. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while generating the summary.",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">AI Engagement Tools</h1>
        <p className="text-muted-foreground font-body text-lg">Connect with others and get key insights from sessions.</p>
      </header>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections"><Users className="mr-2 h-4 w-4" /> Find Connections</TabsTrigger>
          <TabsTrigger value="summaries"><FileText className="mr-2 h-4 w-4" /> Session Summaries</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Find People to Meet</CardTitle>
              <CardDescription>Enter your details and let AI suggest people with common ground.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={peopleForm.handleSubmit(onSuggestSubmit)} className="space-y-4">
                <Input {...peopleForm.register("origin")} placeholder="Your origin (e.g., Mumbai, Maharashtra)" required />
                <Input {...peopleForm.register("language")} placeholder="Primary language you speak (e.g., Marathi)" required />
                <Input {...peopleForm.register("interests")} placeholder="Your interests (e.g., AI, hiking, classical music)" required />
                <Button type="submit" disabled={isSuggesting}>
                  {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Get Suggestions
                </Button>
              </form>
              {suggestions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Here are some people you might want to meet:</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestions.map((person, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-xl">{person.name}</CardTitle>
                          <CardDescription className="flex items-start gap-2 pt-2">
                             <Lightbulb className="h-4 w-4 mt-1 text-primary flex-shrink-0" /> 
                             <span>{person.reason}</span>
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries">
          <Card>
            <CardHeader>
              <CardTitle>Generate Session Summary</CardTitle>
              <CardDescription>Paste a session transcript to get a concise summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={summaryForm.handleSubmit(onSummarizeSubmit)} className="space-y-4">
                <Textarea
                  {...summaryForm.register("transcript")}
                  placeholder="Paste the full session transcript here..."
                  className="min-h-[200px]"
                  required
                />
                <Button type="submit" disabled={isSummarizing}>
                  {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Summarize
                </Button>
              </form>
              {summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Summary:</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                        <p className="font-body whitespace-pre-wrap">{summary}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
