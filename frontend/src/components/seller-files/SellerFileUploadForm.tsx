"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useUploadSellerFile } from "@/hooks/useSellerFilesHooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { dmSans, inter } from "@/lib/fonts";

export default function SellerFileUploadForm({ page }: { page?: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUploadSellerFile(page);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    mutate(file);
    setFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Circular Add Button Trigger */}
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="rounded-full shadow-md bg-indigo-700"
          aria-label="Add marketplace template"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      {/* Dialog with Form */}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className={`${dmSans.className}`}>Create Marketplace Template</DialogTitle>
          <DialogDescription>
            Upload a marketplace attribute template CSV and give it a name.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0 sr-only">
            <CardTitle className="text-base">Template Details</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 md:flex-row md:items-end"
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="seller-file" className={`${inter.className}`}>Seller CSV / Excel</Label>
                <Input
                  id="seller-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className={`${inter.className}`}
                  onChange={(e) =>
                    setFile(
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
              </div>

              <Button type="submit" disabled={isPending || !file} className={`${dmSans.className}`}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
