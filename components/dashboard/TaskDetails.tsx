"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Image } from "lucide-react";

interface Task {
  id: string;
  goal: string;
  title: string;
  status: "PENDING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedTime: string;
  dueDate: string;
  category: string;
  details: {
    description: string;
    links: Array<{ label: string; url: string }>;
    screenshot?: string;
  };
}

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { details } = task;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Description */}
      {details.description && (
        <div>
          <p className="text-sm text-white/70 leading-relaxed">
            {details.description}
          </p>
        </div>
      )}

      {/* Links */}
      {details.links && details.links.length > 0 && (
        <div>
          <h4 className="text-xs text-white/40 mb-3 font-medium tracking-wide uppercase">Resources</h4>
          <div className="flex flex-wrap gap-2">
            {details.links.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 px-3 text-xs bg-transparent border border-white/20 text-white/60 hover:bg-white/5 hover:border-white/30 hover:text-white/80 transition-colors"
                >
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    {link.label}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshot Placeholder */}
      {details.screenshot && (
        <div>
          <h4 className="text-xs text-white/40 mb-3 font-medium tracking-wide uppercase">Preview</h4>
          <motion.div
            className="relative bg-white/5 rounded-lg overflow-hidden border border-white/10"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img
              src={details.screenshot}
              alt={`Screenshot for ${task.title}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center bg-white/5 hidden"
              style={{ display: 'none' }}
            >
              <div className="text-center">
                <Image className="w-6 h-6 text-white/30 mx-auto mb-2" />
                <p className="text-xs text-white/40">Preview unavailable</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Placeholder when no screenshot but we want to show the concept */}
      {!details.screenshot && task.goal === "Learn Python" && (
        <div>
          <h4 className="text-xs text-white/40 mb-3 font-medium tracking-wide uppercase">Preview</h4>
          <motion.div
            className="relative bg-white/5 rounded-lg overflow-hidden border border-white/10 h-24"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Image className="w-4 h-4 text-white/30 mx-auto mb-1" />
                <p className="text-xs text-white/40">python-install.png</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
} 