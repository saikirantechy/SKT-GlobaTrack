"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { generateEventPassDetails, GenerateEventPassDetailsOutput } from "@/ai/flows/generate-event-pass-details"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, QrCode } from "lucide-react"
import { SktLogoIcon } from "@/components/skt-logo-icon"
import { FirebaseLogo } from "@/components/firebase-logo"

const formSchema = z.object({
  attendeeName: z.string().min(2, "Name must be at least 2 characters."),
  role: z.enum(["Attendee", "Volunteer", "Speaker"]),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  languagePreference: z.string().min(2, "Please select a language."),
})

type PassDetails = GenerateEventPassDetailsOutput & { name: string, role: string, gender: string };

const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function EventPassPage() {
  const { toast } = useToast()
  const [passDetails, setPassDetails] = useState<PassDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passPhoto, setPassPhoto] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendeeName: "",
      role: "Attendee",
      gender: "Prefer not to say",
      languagePreference: "en",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setPassDetails(null)
    setPassPhoto(null)
    try {
      let photoUrl = "https://placehold.co/128x128.png";
      if (selectedFile) {
          photoUrl = await readFileAsDataURL(selectedFile);
      }
      
      const result = await generateEventPassDetails(values)
      if (result) {
        setPassDetails({ ...result, name: values.attendeeName, role: values.role, gender: values.gender })
        setPassPhoto(photoUrl)
      } else {
         toast({
            variant: "destructive",
            title: "Pass Generation Failed",
            description: "Could not generate pass details. Please try again.",
          })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while generating the pass.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const getPassColor = (color: string) => {
    switch(color.toLowerCase()){
        case 'green': return 'border-green-500 bg-green-500/10';
        case 'blue': return 'border-blue-500 bg-blue-500/10';
        case 'yellow': return 'border-yellow-500 bg-yellow-500/10';
        default: return 'border-primary bg-primary/10';
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">AI Event Pass Generator</h1>
        <p className="text-muted-foreground font-body text-lg">Create your personalized, scannable event pass in seconds.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>Fill out the form below to generate your event pass.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="attendeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Priya Kumar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                        <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role at the event" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Attendee">Attendee</SelectItem>
                          <SelectItem value="Volunteer">Volunteer</SelectItem>
                          <SelectItem value="Speaker">Speaker</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languagePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preferred language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Pass</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-center">
          {passDetails && passPhoto ? (
            <Card className={`w-full max-w-sm rounded-2xl border-2 shadow-2xl ${getPassColor(passDetails.colorCode)}`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                   <div className="flex w-full justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <SktLogoIcon className="size-8"/>
                            <h2 className="text-xl md:text-2xl font-headline font-bold">SKT GlobaTrack</h2>
                        </div>
                        <FirebaseLogo className="size-10" />
                    </div>
                  <Image 
                    src={passPhoto} 
                    alt="Profile" 
                    width={128} 
                    height={128} 
                    className="rounded-full border-4 border-white shadow-lg -mt-2 aspect-square object-cover" 
                    data-ai-hint="avatar cartoon"
                  />
                  <h3 className="mt-4 text-3xl font-headline font-semibold text-primary">{passDetails.name}</h3>
                  <p className="text-lg text-muted-foreground">{passDetails.role}</p>
                  {passDetails.gender !== "Prefer not to say" && (
                    <p className="text-md text-muted-foreground">{passDetails.gender}</p>
                  )}

                  <div className="my-4 w-full border-t border-dashed pt-4">
                    <p className="text-sm font-semibold mb-1">Event Details</p>
                    <p className="text-sm text-muted-foreground">Bangalore • Today only</p>
                  </div>

                  <div className="mb-6 w-full">
                    <p className="text-sm font-semibold mb-2">Details:</p>
                    <p className="text-sm text-muted-foreground">{passDetails.details}</p>
                  </div>

                  <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify(passDetails))}`} 
                    alt="QR Code"
                    width={150}
                    height={150}
                    className="rounded-lg border-2 p-1"
                    />
                     <p className="text-xs text-muted-foreground mt-2">Scan for details</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                <QrCode className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Your generated pass will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
