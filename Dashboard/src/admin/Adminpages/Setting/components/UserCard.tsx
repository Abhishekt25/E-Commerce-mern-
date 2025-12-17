import React from "react";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  onUpdateRole: (userId: string, newRole: string) => void;
  onDeleteUser: (userId: string) => void;
  showMakeAdmin: boolean;
  showMakeUser: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onUpdateRole,
  onDeleteUser,
  showMakeAdmin,
  showMakeUser
}) => {
  const getRoleColor = (role: string) => {
    return role === "admin" 
      ? "bg-red-100 text-red-800" 
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <span className={`${getRoleColor(user.role)} px-2 py-1 rounded-full text-xs font-semibold`}>
              {user.role.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          {showMakeAdmin && user.role === "user" && (
            <button
              onClick={() => onUpdateRole(user._id, "admin")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors font-medium whitespace-nowrap"
            >
              Make Admin
            </button>
          )}
          {showMakeUser && user.role === "admin" && (
            <button
              onClick={() => onUpdateRole(user._id, "user")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors font-medium whitespace-nowrap"
            >
              Make User
            </button>
          )}
          <button
            onClick={() => onDeleteUser(user._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-medium whitespace-nowrap"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;