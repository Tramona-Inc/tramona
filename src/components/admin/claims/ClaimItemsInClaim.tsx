import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClaimsWDetails } from "./ClaimsOverview";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

function ClaimItemsInClaim({ claim }: { claim: ClaimsWDetails }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Images</TableHead>
                <TableHead className="w-1/4">Description</TableHead>
                <TableHead>Requested Amount</TableHead>
                <TableHead>Outstanding Amount</TableHead>
                <TableHead>Property ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Resolved by Superhog</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claim.claimItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-middle">
                    {item.imageUrls.length > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImage(item.imageUrls[0]!)}
                        className="w-full"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        View {item.imageUrls.length}{" "}
                        {item.imageUrls.length === 1 ? "Image" : "Images"}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No images
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="max-w-xs break-words">
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    {formatCurrency(item.requestedAmount)}
                  </TableCell>
                  <TableCell className="align-middle">
                    {formatCurrency(item.outstandingAmount ?? 0)}
                  </TableCell>
                  <TableCell className="align-middle">
                    {item.propertyId}
                  </TableCell>
                  <TableCell className="align-middle">
                    {format(item.createdAt!, "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell className="align-middle">
                    {item.resolvedBySuperhog ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="align-middle">
                    <Link
                      href={`/admin/reports/claim-details/${claim.claim.id}/resolve`}
                    >
                      <Button size="sm" variant="outline">
                        Resolve
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-video">
            {selectedImage && (
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {claim.claimItems
                    .find((item) => item.imageUrls.includes(selectedImage))
                    ?.imageUrls.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video">
                          <Image
                            src={url}
                            alt={`Claim item image ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ClaimItemsInClaim;
