"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ReactNode, useState } from "react";
import { ToS } from "@/services/tosService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type ToSFormDialogProps = {
  children: ReactNode;
  handleToSFormChange: (field: "title" | "content", value: string) => void;
  currentToS: ToS;
  submit?: (tosId?: string) => Promise<void>;
  mode: "create" | "edit" | "view" | "delete";
  isLoading: boolean;
};

export default function ToSFormDialog({
  children,
  handleToSFormChange,
  currentToS,
  submit,
  mode,
  isLoading,
}: ToSFormDialogProps) {
  const [tosFormDialogOpen, setTosFormDialogOpen] = useState<boolean>(false);

  let title = "";
  let submitButtonText = "";

  switch (mode) {
    case "create":
      title = "New";
      submitButtonText = "Add Template";
      break;
    case "edit":
      title = "Edit";
      submitButtonText = "Update";
      break;
    case "view":
      title = "View";
      break;
    case "delete":
      title = "Delete";
      submitButtonText = "Delete";
      break;
  }

  const tosId = currentToS._id || currentToS.id || "";

  return (
    <Dialog
      open={tosFormDialogOpen}
      onOpenChange={(open) => setTosFormDialogOpen(open)}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-[650px] flex flex-col bg-white overflow-hidden">
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {title} ToS Template
            </DialogTitle>
          </DialogHeader>

          {mode === "delete" ? (
            <div className="py-4 text-center text-sm text-gray-700">
              Are you sure you want to delete this Terms of Service (ToS)
              template:{" "}
              <span className="font-semibold">{currentToS.title}</span>?
            </div>
          ) : (
            <fieldset
              disabled={mode === "view"}
              className="[&_*]:disabled:opacity-100 flex flex-col w-full space-y-4 overflow-y-auto flex-1 px-1 py-2"
            >
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="p-3 rounded-md border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-[#0F1E7A]"
                  placeholder="e.g., Standard Goods Purchase ToS"
                  value={currentToS.title}
                  onChange={(e) => handleToSFormChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Agreement Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  className="p-3 rounded-md border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-[#0F1E7A] min-h-[180px]"
                  placeholder="Enter the detailed terms of service..."
                  rows={8}
                  value={currentToS.content}
                  onChange={(e) =>
                    handleToSFormChange("content", e.target.value)
                  }
                />
              </div>
            </fieldset>
          )}

          <DialogFooter className="flex gap-3 mt-4 pt-2 border-t">
            {mode !== "view" && (
              <Button
                type="button"
                onClick={() => {
                  submit?.(tosId).then(() => setTosFormDialogOpen(false));
                }}
                className={`flex-1 text-white ${
                  mode === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#0F1E7A] hover:bg-[#0a1555]"
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? submitButtonText.slice(0, -1) + "ing..."
                  : submitButtonText}
              </Button>
            )}
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
