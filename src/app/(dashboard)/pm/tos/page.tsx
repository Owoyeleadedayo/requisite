"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ToS, tosService } from "@/services/tosService";
import ToSFormDialog from "@/components/pm/ToSFormDialog";

export default function ToSManagementPage() {
  const [tosList, setTosList] = useState<ToS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [currentToS, setCurrentToS] = useState<ToS>({
    title: "",
    content: "",
  });

  const fetchToSList = useCallback(async () => {
    try {
      setLoading(true);
      /* DEMO: tosService.fetchToSList() reads from local sample JSON — no real API call */
      const data = await tosService.fetchToSList();
      setTosList(data);
    } catch (error) {
      console.error("Failed to fetch ToS templates:", error);
      toast.error("Failed to load ToS templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToSList();
  }, [fetchToSList]);

  const handleToSFormChange = (field: "title" | "content", value: string) => {
    setCurrentToS((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateToS = async () => {
    if (!currentToS.title.trim() || !currentToS.content.trim()) {
      toast.error("Title and Content are required");
      return;
    }
    try {
      setIsSubmitting(true);
      /* DEMO: tosService.createToS() mutates in-memory store — no real API call */
      const created = await tosService.createToS({
        title: currentToS.title.trim(),
        content: currentToS.content.trim(),
      });
      setTosList((prev) => [created, ...prev]);
      toast.success("ToS template created successfully");
      setCurrentToS({ title: "", content: "" });
    } catch (error) {
      console.error("Create ToS error:", error);
      toast.error("Failed to create ToS template");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateToS = async (tosId?: string) => {
    const id = tosId || currentToS._id || currentToS.id;
    if (!id) return;
    if (!currentToS.title.trim() || !currentToS.content.trim()) {
      toast.error("Title and Content are required");
      return;
    }
    try {
      setIsSubmitting(true);
      /* DEMO: tosService.updateToS() mutates in-memory store — no real API call */
      const updated = await tosService.updateToS(id, {
        title: currentToS.title.trim(),
        content: currentToS.content.trim(),
      });
      setTosList((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...t, ...updated } : t)),
      );
      toast.success("ToS template updated successfully");
      setCurrentToS({ title: "", content: "" });
    } catch (error) {
      console.error("Update ToS error:", error);
      toast.error("Failed to update ToS template");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteToS = async (tosId?: string) => {
    const id = tosId || currentToS._id || currentToS.id;
    if (!id) return;
    try {
      setIsSubmitting(true);
      /* DEMO: tosService.deleteToS() mutates in-memory store — no real API call */
      await tosService.deleteToS(id);
      setTosList((prev) => prev.filter((t) => (t._id || t.id) !== id));
      toast.success("ToS template deleted successfully");
      setCurrentToS({ title: "", content: "" });
    } catch (error) {
      console.error("Delete ToS error:", error);
      toast.error("Failed to delete ToS template");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredToS = tosList.filter(
    (tos) =>
      tos.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tos.content?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F1E7A]">
              Terms of Service (ToS)
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage predefined ToS templates for RFQ generation
            </p>
          </div>

          <ToSFormDialog
            mode="create"
            currentToS={currentToS}
            submit={handleCreateToS}
            isLoading={isSubmitting}
            handleToSFormChange={handleToSFormChange}
          >
            <Button
              onClick={() => setCurrentToS({ title: "", content: "" })}
              className="px-4 md:px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-base md:text-md text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add ToS Template
            </Button>
          </ToSFormDialog>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ToS templates by title or content..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* ToS Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A] mb-3"></div>
              <span>Loading ToS templates...</span>
            </div>
          ) : filteredToS.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              {searchQuery
                ? "No ToS templates match your search."
                : "No predefined ToS templates found. Click 'Add ToS Template' to create one."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-16 font-semibold">S/N</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold min-w-[320px]">
                      Content Preview
                    </TableHead>
                    <TableHead className="font-semibold w-40 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredToS.map((tos, idx) => {
                    const id = tos._id || tos.id || String(idx);
                    return (
                      <TableRow
                        key={id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-500">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {tos.title}
                        </TableCell>
                        <TableCell className="text-gray-600 line-clamp-2 max-w-md">
                          {tos.content}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View */}
                            <ToSFormDialog
                              mode="view"
                              currentToS={tos}
                              handleToSFormChange={() => {}}
                              isLoading={false}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-blue-900"
                                title="View ToS"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </ToSFormDialog>

                            {/* Edit */}
                            <ToSFormDialog
                              mode="edit"
                              currentToS={currentToS}
                              handleToSFormChange={handleToSFormChange}
                              submit={handleUpdateToS}
                              isLoading={isSubmitting}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-green-600"
                                title="Edit ToS"
                                onClick={() =>
                                  setCurrentToS({
                                    _id: tos._id,
                                    id: tos.id,
                                    title: tos.title,
                                    content: tos.content,
                                  })
                                }
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </ToSFormDialog>

                            {/* Delete */}
                            <ToSFormDialog
                              mode="delete"
                              currentToS={currentToS}
                              handleToSFormChange={() => {}}
                              submit={handleDeleteToS}
                              isLoading={isSubmitting}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-red-600"
                                title="Delete ToS"
                                onClick={() =>
                                  setCurrentToS({
                                    _id: tos._id,
                                    id: tos.id,
                                    title: tos.title,
                                    content: tos.content,
                                  })
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </ToSFormDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
