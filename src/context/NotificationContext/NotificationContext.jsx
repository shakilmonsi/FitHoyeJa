import React, { createContext, useState, useEffect } from "react";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const initialLastReadTimestamp = localStorage.getItem("lastReadTimestamp");
  console.log(initialLastReadTimestamp);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const dummyNotifications = [
    {
      id: 1,
      title: "إعلان جديد",
      description: "بنك ومكتب. للبيع وتأجير المحلات",
      timeAgo: "قبل 12 ساعة",
      adCode: "COD-23239",
    },
    {
      id: 1,
      title: "إعلان جديد",
      description: "بنك ومكتب. للبيع وتأجير المحلات",
      timeAgo: "قبل 12 ساعة",
      adCode: "COD-23239",
    },
    {
      id: 2,
      title: "إعلان جديد",
      description: "بنك ومكتب. للبيع وتأجير المحلات",
      timeAgo: "قبل 10 ساعات",
      adCode: "COD-244",
    },
    {
      id: 2,
      title: "إعلان جديد",
      description: "بنك ومكتب. للبيع وتأجير المحلات",
      timeAgo: "قبل 10 ساعات",
      adCode: "COD-4245",
    },
    {
      id: 2,
      title: "إعلان جديد",
      description: "بنك ومكتب. للبيع وتأجير المحلات",
      timeAgo: "قبل 10 ساعات",
      adCode: "COD-242556",
    },
    {
      id: 2,
      title: "إعلان جديد",
      description: "بنك ومكتب. للبيع وتأجير المحلات",
      timeAgo: "قبل 10 ساعات",
      adCode: "COD-7340",
    },
    {
      id: 3,
      title: "بيت جديد",
      description: "شقة سكنية مميزة في منطقة حيوية",
      timeAgo: "قبل ساعتين",
      adCode: "COD-7341",
    },
  ];
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = dummyNotifications;

        setNotifications(fetchedNotifications);
        setLoading(false);

        const lastReadTimestamp = localStorage.getItem("lastReadTimestamp");

        const newUnreadCount = fetchedNotifications.filter((n) => {
          if (!lastReadTimestamp) {
            return !n.isRead;
          }
          return (
            !n.isRead && new Date(n.timestamp) > new Date(lastReadTimestamp)
          );
        }).length;

        setUnreadCount(newUnreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setLoading(false);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);

      localStorage.setItem("lastReadTimestamp", new Date().toISOString());
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const contextValue = {
    notifications,
    loading,
    unreadCount,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
