import { useState } from "react";

const Notification = ({ isOpen, onClose }) => {
  // Mock notifications data - in real app, this would come from API
  const notifications = [
    {
      id: 1,
      title: "Election Reminder",
      message: "Don't forget to vote in the upcoming assembly election!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Profile Update",
      message: "Your profile information has been updated successfully.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "New Candidate",
      message: "A new candidate has been registered for the election.",
      time: "2 days ago",
      read: true,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {notification.time}
                  </span>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default Notification;
