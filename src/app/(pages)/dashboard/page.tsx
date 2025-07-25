"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts"
import { Users, MapPin, Building, Languages as LanguageIcon, PersonStanding } from "lucide-react"

const regionalData = [
  { area: "Koramangala", attendees: 150 },
  { area: "Indiranagar", attendees: 110 },
  { area: "HSR Layout", attendees: 95 },
  { area: "Whitefield", attendees: 80 },
  { area: "Marathahalli", attendees: 70 },
  { area: "Electronic City", attendees: 50 },
  { area: "Others", attendees: 30 },
]

const genderData = [
  { name: 'Male', value: 385, fill: 'var(--color-Male)' },
  { name: 'Female', value: 185, fill: 'var(--color-Female)' },
  { name: 'Other', value: 15, fill: 'var(--color-Other)' },
]

const languageData = [
    { name: 'English', value: 450, fill: 'var(--color-English)' },
    { name: 'Hindi', value: 280, fill: 'var(--color-Hindi)' },
    { name: 'Marathi', value: 120, fill: 'var(--color-Marathi)' },
    { name: 'Kannada', value: 90, fill: 'var(--color-Kannada)' },
    { name: 'Other-Lang', value: 150, fill: 'var(--color-Other-Lang)' },
]

const chartConfig: ChartConfig = {
  attendees: {
    label: "Attendees",
    color: "hsl(var(--chart-1))",
  },
}

const genderChartConfig: ChartConfig = {
    Male: { label: 'Male', color: 'hsl(var(--chart-1))' },
    Female: { label: 'Female', color: 'hsl(var(--chart-2))' },
    Other: { label: 'Other', color: 'hsl(var(--chart-4))' },
}

const languageChartConfig: ChartConfig = {
    English: { label: 'English', color: 'hsl(var(--chart-1))' },
    Hindi: { label: 'Hindi', color: 'hsl(var(--chart-2))' },
    Marathi: { label: 'Marathi', color: 'hsl(var(--chart-3))' },
    Kannada: { label: 'Kannada', color: 'hsl(var(--chart-4))' },
    'Other-Lang': { label: 'Other', color: 'hsl(var(--chart-5))' },
}


const roomData = [
    { name: "Main Auditorium", occupancy: 85 },
    { name: "Hall A", occupancy: 60 },
    { name: "Hall B", occupancy: 72 },
    { name: "Workshop Room 1", occupancy: 95 },
    { name: "Workshop Room 2", occupancy: 40 },
]

export default function DashboardPage() {
  const totalAttendees = 585
  const totalCapacity = 750
  const onWaitlist = 32
  const occupancyPercentage = (totalAttendees / totalCapacity) * 100

  return (
    <div className="flex flex-col gap-8">
      <header className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-headline font-bold text-primary">Smart Event Dashboard</h1>
        <p className="text-muted-foreground font-body text-lg">Real-time event intelligence at your fingertips.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees} / {totalCapacity}</div>
            <p className="text-xs text-muted-foreground">attendees</p>
            <Progress value={occupancyPercentage} className="mt-4" />
          </CardContent>
        </Card>
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Waitlist</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{onWaitlist}</div>
            <p className="text-xs text-muted-foreground">people waiting for a spot</p>
          </CardContent>
        </Card>
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Occupancy</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
             {roomData.slice(0, 2).map((room) => (
              <div key={room.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{room.name}</span>
                  <span className="text-muted-foreground">{room.occupancy}%</span>
                </div>
                <Progress value={room.occupancy} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Attendee Distribution</CardTitle>
            <CardDescription>Attendees from different areas in Bangalore</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={regionalData} margin={{ top: 20, right: 20, bottom: 5, left: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="area"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="attendees" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PersonStanding className="h-5 w-5" /> Gender Diversity</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={genderChartConfig} className="mx-auto aspect-square h-[250px]">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={60}>
                         {genderData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
       <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><LanguageIcon className="h-5 w-5" /> Language Diversity</CardTitle>
            <CardDescription>Primary languages spoken by attendees</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={languageChartConfig} className="mx-auto aspect-video h-[250px]">
                 <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie data={languageData} dataKey="value" nameKey="name" >
                        {languageData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
        </CardContent>
       </Card>
    </div>
  )
}
