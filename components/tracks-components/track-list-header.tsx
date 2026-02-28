import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function TrackListHeader({
  playlistName,
  onBack,
  subtitle,
}: {
  playlistName: string;
  onBack?: () => void;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div>
        <h2 className="text-lg font-semibold">{playlistName}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default TrackListHeader;
