import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LaunchConfirmationDialogProps {
  isOpen: boolean;
  ndaSignedCount: number;
  onClose: () => void;
  onLaunchWithoutInviting: () => void;
  onInviteMore: () => void;
}

export function LaunchConfirmationDialog({
  isOpen,
  ndaSignedCount,
  onClose,
  onLaunchWithoutInviting,
  onInviteMore
}: LaunchConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ready to Launch?</DialogTitle>
          <DialogDescription>
            You currently have {ndaSignedCount} provider{ndaSignedCount !== 1 ? 's' : ''} working with you.
            {ndaSignedCount < 5 && (
              <span className="block mt-2 font-medium text-gray-900">
                We recommend inviting {5 - ndaSignedCount} more to make a competitive process.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onLaunchWithoutInviting}
            className="w-full sm:w-auto"
          >
            Continue without inviting more
          </Button>
          <Button
            onClick={onInviteMore}
            className="w-full sm:w-auto bg-vendle-blue hover:bg-vendle-blue/90"
          >
            Invite more
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
