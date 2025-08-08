import { Loader2 } from "lucide-react";

export default function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium">Loading application...</h2>
        <p className="text-muted-foreground text-sm">
          Setting up your family chores dashboard
        </p>
      </div>
    </div>
  );
}
