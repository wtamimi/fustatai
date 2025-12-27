"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApiKeys } from "@/hooks/use-api-keys-2";
import { ApiKeyFormDialog } from "./form-dialog";
import { ApiKey } from "@/lib/types/api-keys-2";
import {
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export function ApiKeysTable({ onSuccess }: { onSuccess?: () => void }) {
  const { ApiKeys, loading, error, deleteApiKey, fetchApiKeys } = useApiKeys();
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingApiKey) return;

    setIsDeleting(true);
    try {
      await deleteApiKey(deletingApiKey.id);
      onSuccess?.();
      setDeletingApiKey(null);
    } catch (error) {
      console.error("Failed to delete api key:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchApiKeys();
  };

  const getProviderBadgeVariant = (provider: string) => {
    const lowerProvider = provider.toLowerCase();
    switch (lowerProvider) {
      case "openai":
        return "default";
      case "anthropic":
        return "secondary";
      case "google":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Api Keys
            <Loader2 className="h-4 w-4 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading Api Keys...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Api Keys
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <p className="text-destructive font-medium mb-2">
                Failed to load api keys
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Api Keys</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {ApiKeys.length} api key{ApiKeys.length !== 1 ? "s" : ""}
              </span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ApiKeys.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No Api Keys found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first Api Key to get started with AI
                integrations.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[150px]">Provider</TableHead>
                    <TableHead className="w-[200px]">Model Name</TableHead>
                    <TableHead className="min-w-[300px]">Base URL</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[70px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ApiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {apiKey.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getProviderBadgeVariant(apiKey.provider_name)}
                        >
                          {apiKey.provider_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {apiKey.model_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[300px]">
                          <span className="truncate text-sm">
                            {apiKey.base_url}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() =>
                              window.open(apiKey.base_url, "_blank")
                            }
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          onClick={() => setEditingApiKey(apiKey)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => setDeletingApiKey(apiKey)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/*
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              title="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem
                              onClick={() => setEditingModel(model)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => setDeletingModel(model)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Api Keys Dialog */}
      <ApiKeyFormDialog
        apiKey={editingApiKey}
        open={!!editingApiKey}
        onOpenChange={(open) => !open && setEditingApiKey(null)}
        onSuccess={onSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingApiKey}
        onOpenChange={(open) => !open && setDeletingApiKey(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Api Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the api key &quot;
              {deletingApiKey?.name}&quot; from {deletingApiKey?.provider_name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
