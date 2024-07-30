import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import dayjs from "dayjs";
import { type BucketListDestination } from "@/server/db/schema";

type Props = {
  destination: BucketListDestination;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DestinationCard({
  destination,
  onEdit,
  onDelete
}: Props) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex flex-row justify-between">
        <div className="flex flex-col space-y-0.5">
          <h3 className="font-bold">{destination.location}</h3>
          <p>{dayjs(destination.plannedCheckIn).format('MM/DD/YYYY')} - {dayjs(destination.plannedCheckOut).format('MM/DD/YYYY')}</p>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-1 py-1 items-start h-auto">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" alignOffset={-8} className="min-w-40 px-2">
              <DropdownMenuItem className="text-base font-semibold" onClick={onEdit}>
                <Pencil size={20} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base font-semibold text-red-800" onClick={onDelete}>
                <Trash2 size={20} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
