import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  PhoneIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NotificationContext } from "../../context/NotificationContext/NotificationContext";

const NotificationCard = ({ notification }) => {
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          {notification.title}
        </h3>
        <span className="text-sm text-gray-500">{notification.timeAgo}</span>
      </div>
      <p className="mb-4 text-gray-600">{notification.description}</p>
      <div className="flex items-center gap-x-2 space-x-4 text-sm font-semibold rtl:space-x-reverse">
        <div className="flex items-center space-x-2 text-green-600 rtl:space-x-reverse">
          <PhoneIcon className="h-4 w-4" />
          <span className="text-[14px] font-[700]">
            {notification.phoneNumber}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-blue-600 rtl:space-x-reverse">
          <span className="text-[14px] font-[600]">{notification.adCode}</span>
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const { notifications, loading, markAllAsRead } =
    useContext(NotificationContext);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading) {
      markAllAsRead();
    }
  }, [loading, markAllAsRead]);

  const filteredNotifications = useMemo(() => {
    if (!searchTerm) {
      return notifications;
    }
    return notifications.filter((notification) =>
      notification.adCode.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [notifications, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="mx-auto flex items-center justify-center sm:pt-6">
      <div className="md:lg-bg-white w-[940px] bg-white pb-24 font-sans sm:pb-2">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between rounded-lg border-1 border-gray-400 bg-white p-2 shadow-md">
            <MagnifyingGlassIcon className="mr-2 h-5 w-5 text-gray-400 rtl:mr-0 rtl:ml-2" />
            <input
              type="text"
              placeholder="Search by Ad Code..."
              className="w-full p-1 text-gray-700 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <XMarkIcon
                className="h-5 w-5 cursor-pointer text-gray-400"
                onClick={handleClearSearch}
              />
            )}
          </div>

          <div>
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">
                No notifications match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
