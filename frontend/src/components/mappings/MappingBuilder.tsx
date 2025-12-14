"use client";

import { useMemo } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMappingUiStore } from "@/stores/useUiMappingStore";
import { useMarketplaceTemplates } from "@/hooks/useMarketplaceHooks";
import { useSellerFiles } from "@/hooks/useSellerFilesHooks";
import { useCreateMapping } from "@/hooks/useMappingHooks";
import { inter } from "@/lib/fonts";

export default function MappingBuilder() {
  const {
    selectedMarketplaceTemplateId,
    selectedSellerFileId,
    attributeMappings,
    setSelectedMarketplaceTemplateId,
    setSelectedSellerFileId,
    setAttributeMapping,
    isColumnAlreadyMapped,
  } = useMappingUiStore();

  const { data: templates } = useMarketplaceTemplates();
  const { data: sellerFiles } = useSellerFiles();
  const { mutate, isPending, error } = useCreateMapping();

  const selectedTemplate = useMemo(
    () => templates?.items.find((t) => t.id === selectedMarketplaceTemplateId) ?? null,
    [templates, selectedMarketplaceTemplateId]
  );

  const selectedFile = useMemo(
    () => sellerFiles?.items.find((f) => f.id === selectedSellerFileId) ?? null,
    [sellerFiles, selectedSellerFileId]
  );

  const handleSave = () => {
    if (!selectedTemplate || !selectedFile) return;

    const items = selectedTemplate.attributes
      .map((attr) => {
        const colName = attributeMappings[attr.id];
        if (!colName) return null;
        return {
          marketplaceAttributeId: attr.id,
          sellerColumnName: colName.trim().replace(/^"+|"+$/g, ""),
        };
      })
      .filter(Boolean) as {
        marketplaceAttributeId: number;
        sellerColumnName: string;
      }[];

    if (items.length === 0) return;

    mutate({
      marketplaceTemplateId: selectedTemplate.id,
      sellerFileId: selectedFile.id,
      items,
    });
  };

  return (
    <div className={`${inter.className} space-y-8`}>
      <Card>
        <CardHeader>
          <CardTitle>Create Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {(error as any)?.message || "Failed to create mapping."}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Marketplace Template</p>
              <Select
                value={selectedMarketplaceTemplateId?.toString() ?? ""}
                onValueChange={(value) =>
                  setSelectedMarketplaceTemplateId(Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marketplace template" />
                </SelectTrigger>
                <SelectContent>
                  {templates?.items.map((tpl) => (
                    <SelectItem key={tpl.id} value={tpl.id.toString()}>
                      {tpl.name.trim().replace(/^"+|"+$/g, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Seller File</p>
              <Select
                value={selectedSellerFileId?.toString() ?? ""}
                onValueChange={(value) =>
                  setSelectedSellerFileId(Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seller file" />
                </SelectTrigger>
                <SelectContent>
                  {sellerFiles?.items.map((file) => (
                    <SelectItem key={file.id} value={file.id.toString()}>
                      {file.fileName.trim().replace(/^"+|"+$/g, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTemplate && selectedFile && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Mapping <span className="font-medium">{selectedTemplate.name}</span>{" "}
                attributes to seller file{" "}
                <span className="font-medium">{selectedFile.fileName}</span>.
              </p>
              <p>
                Each seller column can only be mapped once (1-to-1). Already
                mapped options will be disabled.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTemplate && selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Attribute Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marketplace Attribute</TableHead>
                    <TableHead>Seller Column</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTemplate.attributes.map((attr) => (
                    <TableRow key={attr.id}>
                      <TableCell>{attr.name.trim().replace(/^"+|"+$/g, "")}</TableCell>
                      <TableCell>
                        <Select
                          value={attributeMappings[attr.id] ?? "_none"}
                          onValueChange={(value) =>
                            setAttributeMapping(
                              attr.id,
                              value === "_none" ? null : value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">(none)</SelectItem>
                            {selectedFile.columns.map((col) => (
                              <SelectItem
                                key={col}
                                value={col}
                                disabled={
                                  isColumnAlreadyMapped(col) &&
                                  attributeMappings[attr.id] !== col
                                }
                              >
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isPending || !selectedTemplate || !selectedFile}
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Mapping
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
