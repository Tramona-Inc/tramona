import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import { CircleCheckBig,} from 'lucide-react';

interface CongratsDialogProps {
  location: string
}

export function CongratsDialog({location}:CongratsDialogProps) {
  const [open, setOpen] = useState(true);
  if(!open){
    localStorage.removeItem("requestLocation")
    localStorage.removeItem("showCongratsDialog")
  }
    return (
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <div className="mb-4 flex flex-row items-center text-center text-2xl font-bold">
                <CircleCheckBig color="#528456" className="mr-2" /> Request
                sent!
              </div>
              <p className="mb-4 ml-8">
                We sent your request out to every host in{" "}
                <b>{location}</b>. In the next
                24 hours, hosts will send you properties that match your
                requirements. Add your friends so they can see the matches and stay informed
                with the trip details.
              </p>
            </DialogContent>
            </Dialog>

    )}