"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { useCreateMarketplaceTemplate } from "@/hooks/useMarketplaceHooks";
import { dmSans, inter } from "@/lib/fonts";

export default function MarketplaceTemplateForm({ page }: { page?: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useCreateMarketplaceTemplate(page);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !file) return;

    mutate(
      { name, file },
      {
        onSuccess: () => {
          alert(`Marketplace template "${name}" has been saved.`);
          setName("");
          setFile(null);
          setOpen(false);
        },
        onError: (error: any) => {
          alert(
            `Failed to create template: ${error?.message ?? "Something went wrong."
            }`
          );
        },
      }
    );
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
          <DialogDescription className={`${inter.className}`}>
            Upload a marketplace attribute template CSV and give it a name.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0 sr-only">
            <CardTitle className={`${dmSans.className} text-base `}>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketplace-name" className={`${dmSans.className}`}>Marketplace Name</Label>
                <Input
                  id="marketplace-name"
                  className={`${inter.className}`}
                  placeholder="e.g. Myntra, Amazon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-file" className={`${dmSans.className}`}>Template CSV</Label>
                <Input
                  id="template-file"
                  className={`${inter.className}`}
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    setFile(
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
                <p className={`text-xs text-muted-foreground ${inter.className}`}>
                  The header row will be used as marketplace attributes.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className={`${dmSans.className}`}
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" className={`${dmSans.className}`} disabled={isPending || !name || !file}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
