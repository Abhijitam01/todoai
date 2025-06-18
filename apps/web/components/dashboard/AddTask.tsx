"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTaskToasts } from "@/components/ui/toast";

export function AddTask() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const toasts = useTaskToasts();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    // TODO: Integrate with task store/API
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setTitle("");
      toasts.onTaskCreated(title);
    }, 800);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        className="rounded-full p-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 shadow-xl border-2 border-white/20 backdrop-blur"
        style={{ width: 64, height: 64 }}
        onClick={() => setOpen(true)}
        aria-label="Add Task"
      >
        <span className="flex items-center justify-center w-full h-full bg-white/10 rounded-full">
          <Plus className="w-8 h-8 text-white drop-shadow" />
        </span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md"
            >
              <Card className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 border border-white/10 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add Task</h2>
                    <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <Input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Task title"
                      className="bg-white/10 text-white placeholder:text-gray-400 border border-white/10 focus:border-purple-400"
                      autoFocus
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      disabled={loading || !title.trim()}
                    >
                      {loading ? "Adding..." : "Add Task"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 