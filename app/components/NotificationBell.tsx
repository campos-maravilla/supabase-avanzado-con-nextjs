"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/client";

interface Notification {
  id: number | string;
  user_id: string;
  created_at: string;
  [key: string]: unknown;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  // Obtener usuario actual
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    // Obtener notificaciones iniciales
    if (!userId) return;
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
    };

    fetchNotifications();

    // 🔥 Suscripción realtime
    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Nueva notificación:", payload);

          const newNotification = payload.new as Notification;

          setNotifications((prev) => [newNotification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="relative">
      {/* Botón campana */}
      <button className="relative p-2 hover:bg-foreground/10 rounded-full transition-colors">
        {/* Badge */}
        🔔 {notifications.length}
      </button>

      {/* Dropdown */}
    </div>
  );
}
