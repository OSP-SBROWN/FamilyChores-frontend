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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-foreground mb-4">
          Family Chores
        </h1>
        <p className="text-xl text-default-600 mb-2">
          ReactVersion3 - Clean, Modern, & Beautiful
        </p>
        <p className="text-default-500">
          Built with HeroUI, React Router v7, and Material 3 design principles
        </p>
      </div>

      <Divider className="mb-12" />

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="border-2 hover:border-primary-300 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-serif font-semibold">Timezone Management</h3>
              <p className="text-sm text-default-500">Organize time periods</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600 mb-4">
              Create and manage time periods like "Before Breakfast" or "After School" 
              with beautiful drag-and-drop reordering.
            </p>
            <Button
              as={Link}
              to="/timezones"
              color="primary"
              variant="flat"
              className="w-full"
            >
              Manage Timezones
            </Button>
          </CardBody>
        </Card>

        <Card className="border-2 hover:border-secondary-300 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex gap-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-serif font-semibold">People Management</h3>
              <p className="text-sm text-default-500">Family members</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600 mb-4">
              Add and manage family members, set their preferences, and track 
              their chore completion history.
            </p>
            <Button
              color="secondary"
              variant="flat"
              className="w-full"
              isDisabled
            >
              Coming Soon
            </Button>
          </CardBody>
        </Card>

        <Card className="border-2 hover:border-success-300 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Calendar className="w-6 h-6 text-success-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-serif font-semibold">Chore Management</h3>
              <p className="text-sm text-default-500">Task organization</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600 mb-4">
              Create chores, assign them to family members, and organize them 
              with an intuitive kanban-style interface.
            </p>
            <Button
              color="success"
              variant="flat"
              className="w-full"
              isDisabled
            >
              Coming Soon
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-serif font-bold">Technology Stack</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-sm mb-1">Frontend</h4>
              <p className="text-xs text-default-600">React Router v7</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-sm mb-1">UI Library</h4>
              <p className="text-xs text-default-600">HeroUI</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-sm mb-1">Styling</h4>
              <p className="text-xs text-default-600">Tailwind CSS</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-sm mb-1">Backend</h4>
              <p className="text-xs text-default-600">Express + PostgreSQL</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* API Status */}
      <div className="mt-8 text-center">
        <p className="text-sm text-default-500">
          Backend API running on <code className="bg-default-100 px-2 py-1 rounded">localhost:4001</code>
        </p>
        <p className="text-xs text-default-400 mt-1">
          Ready for timezone management with full CRUD operations
        </p>
      </div>
    </div>
  );
}
