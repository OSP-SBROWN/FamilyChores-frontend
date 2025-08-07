import { Link } from "react-router";
import { Clock, Users, Calendar, Settings, BarChart3, CheckSquare } from "lucide-react";
import AppLayout from "../components/AppLayout";
import ApiHealthIndicator from "../components/ApiHealthIndicator";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

export default function Home() {
  return (
    <AppLayout>
      <div className="relative overflow-hidden">
        {/* Very subtle background shapes */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-white/30 to-[#8ECAE6]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-r from-[#8ECAE6]/20 to-[#219EBC]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-white/20 to-[#8ECAE6]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="relative mb-6">
              <h1 className="text-6xl md:text-7xl font-serif font-bold bg-gradient-to-r from-[#023047] via-[#219EBC] to-[#8ECAE6] bg-clip-text text-transparent mb-4 drop-shadow-sm">
                ChoreNest
              </h1>
              <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-[#8ECAE6]/30 to-[#219EBC]/30 blur-lg opacity-50 -z-10 rounded-lg"></div>
            </div>
            <p className="text-2xl text-[#023047] mb-3 font-medium drop-shadow-sm">
              Family Chore Management - Clean, Modern, & Beautiful
            </p>
            <p className="text-lg text-[#219EBC] max-w-2xl mx-auto">
              Built with Shadcn UI, React Router v7, and modern design principles for the perfect family organization experience
            </p>
          </div>

          <Separator className="mb-16 bg-gradient-to-r from-transparent via-[#219EBC] to-transparent h-0.5" />

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#8ECAE6]/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#8ECAE6] to-[#219EBC] rounded-xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">Timezone Management</h3>
                  <p className="text-sm text-[#219EBC]/80">Organize time periods</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Create and manage time periods like "Before Breakfast" or "After School" 
                  with beautiful drag-and-drop reordering.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link to="/timezones">Manage Timezones</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#FFB703]/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#FFB703] to-[#FB8500] rounded-xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">People Management</h3>
                  <p className="text-sm text-[#FB8500]/80">Family members</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Add and manage family members, set their preferences, and track 
                  their chore completion history.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link to="/people">Manage People</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#219EBC]/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#219EBC] to-[#8ECAE6] rounded-xl shadow-lg">
                  <CheckSquare className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">Availability Matrix</h3>
                  <p className="text-sm text-[#219EBC]/80">Schedule management</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Set when people are available across different days and time periods 
                  with an interactive grid interface.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#219EBC] to-[#8ECAE6] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link to="/availability">Manage Availability</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#219EBC]/30 md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#219EBC] to-[#023047] rounded-xl shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">Chore Management</h3>
                  <p className="text-sm text-[#219EBC]/80">Task organization</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Create chores, assign them to family members, and organize them 
                  with an intuitive kanban-style interface.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-[#219EBC] to-[#023047] text-white font-semibold shadow-lg opacity-70 cursor-not-allowed"
                  size="lg"
                  disabled
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack */}
          <Card className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 border-0 shadow-2xl backdrop-blur-lg border border-white/30 mb-12">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#023047] to-[#219EBC] rounded-xl shadow-lg">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-[#023047] to-[#219EBC] bg-clip-text text-transparent">
                  Technology Stack
                </h2>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-6 bg-gradient-to-br from-[#8ECAE6]/20 to-[#219EBC]/20 rounded-xl shadow-lg border border-[#8ECAE6]/50">
                  <h4 className="font-bold text-[#023047] mb-2">Frontend</h4>
                  <p className="text-sm text-[#219EBC]">React Router v7</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-[#219EBC]/20 to-[#023047]/20 rounded-xl shadow-lg border border-[#219EBC]/50">
                  <h4 className="font-bold text-[#023047] mb-2">UI Library</h4>
                  <p className="text-sm text-[#219EBC]">Shadcn UI</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-[#FFB703]/20 to-[#FB8500]/20 rounded-xl shadow-lg border border-[#FFB703]/50">
                  <h4 className="font-bold text-[#023047] mb-2">Styling</h4>
                  <p className="text-sm text-[#FB8500]">Tailwind CSS</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-[#FB8500]/20 to-[#FFB703]/20 rounded-xl shadow-lg border border-[#FB8500]/50">
                  <h4 className="font-bold text-[#023047] mb-2">Backend</h4>
                  <p className="text-sm text-[#FB8500]">Vercel + Neon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Status and Docs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ApiHealthIndicator />
            </div>
            
            <div className="lg:col-span-2">
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-[#219EBC]" />
                    <h3 className="font-semibold text-[#023047]">Development Info</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-gradient-to-br from-[#8ECAE6]/20 to-[#219EBC]/20 rounded-lg">
                      <h4 className="font-bold text-[#023047] mb-1 text-sm">Frontend</h4>
                      <p className="text-xs text-[#219EBC]">React Router v7</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#219EBC]/20 to-[#023047]/20 rounded-lg">
                      <h4 className="font-bold text-[#023047] mb-1 text-sm">UI Library</h4>
                      <p className="text-xs text-[#219EBC]">Shadcn UI</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#FFB703]/20 to-[#FB8500]/20 rounded-lg">
                      <h4 className="font-bold text-[#023047] mb-1 text-sm">Styling</h4>
                      <p className="text-xs text-[#FB8500]">Tailwind CSS</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#FB8500]/20 to-[#FFB703]/20 rounded-lg">
                      <h4 className="font-bold text-[#023047] mb-1 text-sm">Backend</h4>
                      <p className="text-xs text-[#FB8500]">Vercel + Neon</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#8ECAE6]/10 rounded-lg p-4">
                    <p className="text-[#023047] text-sm">
                      <strong>Database:</strong> Neon PostgreSQL with Prisma ORM
                    </p>
                    <p className="text-[#023047] text-sm mt-1">
                      <strong>Authentication:</strong> Auth0 with custom UI
                    </p>
                    <p className="text-[#023047] text-sm mt-1">
                      <strong>Deployment:</strong> Vercel Serverless Functions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
