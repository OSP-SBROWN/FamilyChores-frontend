import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react";
import { Clock, Users, Calendar, Settings } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Family Chores - ReactVersion3" },
    { name: "description", content: "Modern family chore management system" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative mb-6">
            <h1 className="text-6xl md:text-7xl font-serif font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
              Family Chores
            </h1>
            <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-primary-100 to-secondary-100 blur-lg opacity-30 -z-10 rounded-lg"></div>
          </div>
          <p className="text-2xl text-primary-700 mb-3 font-medium">
            ReactVersion3 - Clean, Modern, & Beautiful
          </p>
          <p className="text-lg text-primary-600/80 max-w-2xl mx-auto">
            Built with HeroUI, React Router v7, and Material 3 design principles for the perfect family organization experience
          </p>
        </div>

      <Divider className="mb-16 bg-gradient-to-r from-transparent via-primary-300 to-transparent h-0.5" />

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-primary-50 backdrop-blur-sm">
          <CardHeader className="flex gap-4 pb-2">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-serif font-bold text-primary-700">Timezone Management</h3>
              <p className="text-sm text-primary-600/70">Organize time periods</p>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <p className="text-primary-700/80 mb-6 leading-relaxed">
              Create and manage time periods like "Before Breakfast" or "After School" 
              with beautiful drag-and-drop reordering.
            </p>
            <Button
              as={Link}
              to="/timezones"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              Manage Timezones
            </Button>
          </CardBody>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-secondary-50 backdrop-blur-sm">
          <CardHeader className="flex gap-4 pb-2">
            <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-serif font-bold text-secondary-700">People Management</h3>
              <p className="text-sm text-secondary-600/70">Family members</p>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <p className="text-secondary-700/80 mb-6 leading-relaxed">
              Add and manage family members, set their preferences, and track 
              their chore completion history.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-secondary-400 to-secondary-500 text-white font-semibold shadow-lg opacity-60 cursor-not-allowed"
              size="lg"
              isDisabled
            >
              Coming Soon
            </Button>
          </CardBody>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-success-50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
          <CardHeader className="flex gap-4 pb-2">
            <div className="p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-serif font-bold text-success-700">Chore Management</h3>
              <p className="text-sm text-success-600/70">Task organization</p>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <p className="text-success-700/80 mb-6 leading-relaxed">
              Create chores, assign them to family members, and organize them 
              with an intuitive kanban-style interface.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-success-400 to-success-500 text-white font-semibold shadow-lg opacity-60 cursor-not-allowed"
              size="lg"
              isDisabled
            >
              Coming Soon
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 border-0 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Technology Stack
            </h2>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-lg border border-primary-100">
              <h4 className="font-bold text-primary-700 mb-2">Frontend</h4>
              <p className="text-sm text-primary-600">React Router v7</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-secondary-50 rounded-xl shadow-lg border border-secondary-100">
              <h4 className="font-bold text-secondary-700 mb-2">UI Library</h4>
              <p className="text-sm text-secondary-600">HeroUI</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-success-50 rounded-xl shadow-lg border border-success-100">
              <h4 className="font-bold text-success-700 mb-2">Styling</h4>
              <p className="text-sm text-success-600">Tailwind CSS</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-warning-50 rounded-xl shadow-lg border border-warning-100">
              <h4 className="font-bold text-warning-700 mb-2">Backend</h4>
              <p className="text-sm text-warning-600">Vercel + Neon</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* API Status */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 px-8 py-4 rounded-full shadow-lg border border-primary-200">
          <div className="w-3 h-3 bg-gradient-to-r from-success-400 to-success-500 rounded-full animate-pulse"></div>
          <p className="text-primary-700 font-medium">
            Backend API running on <code className="bg-primary-100 text-primary-800 px-3 py-1 rounded-lg font-mono text-sm">Vercel Serverless</code>
          </p>
        </div>
        <p className="text-primary-600/70 mt-4 text-sm">
          Ready for timezone management with full CRUD operations
        </p>
      </div>
      
      </div>
    </div>
  );
}
