"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertTriangle, Info, XCircle, Trash2, CheckCheck } from "lucide-react";
import { useNotifications, ToastType } from "../CustomHooks/useNotifications";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const latestNotifications = notifications.slice(0, 5);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "info":
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-14 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-extrabold text-sm text-[#1b2620]">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="text-xs font-bold text-gray-500 hover:text-[#1b2620] flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {latestNotifications.length === 0 ? (
              <div className="p-8 text-center text-sm font-bold text-gray-400">
                You have no notifications.
              </div>
            ) : (
              latestNotifications.map(notification => (
                <div 
                  key={notification._id} 
                  onClick={() => { if (!notification.isRead) markAsRead(notification._id); }}
                  className={`p-4 border-b border-gray-50 flex gap-3 cursor-pointer transition-colors hover:bg-gray-50 ${notification.isRead ? "opacity-70" : "bg-white"}`}
                >
                  <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className={`text-sm ${notification.isRead ? "font-semibold text-gray-600" : "font-extrabold text-[#1b2620]"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#c8e639] flex-shrink-0 mt-1"></div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <Link href="/en/profile?tab=notifications" onClick={onClose} className="text-xs font-extrabold text-[#1b2620] block w-full">
              View all notifications
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
