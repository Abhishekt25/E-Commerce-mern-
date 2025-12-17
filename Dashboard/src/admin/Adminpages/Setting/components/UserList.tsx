import React, { useState } from "react";
import UserCard from "./UserCard";
import Pagination from "./Pagination";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserListProps {
  title: string;
  users: User[];
  onUpdateRole: (userId: string, newRole: string) => void;
  onDeleteUser: (userId: string) => void;
  badgeColor: string;
  badgeText: string;
  showMakeAdmin?: boolean;
  showMakeUser?: boolean;
  itemsPerPage?: number;
}

const UserList: React.FC<UserListProps> = ({
  title,
  users,
  onUpdateRole,
  onDeleteUser,
  badgeColor,
  badgeText,
  showMakeAdmin = false,
  showMakeUser = false,
  itemsPerPage = 5
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when users change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className={`${badgeColor} px-3 py-1 rounded-full text-sm font-semibold`}>
            {users.length} {badgeText}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages} • Showing {paginatedUsers.length} of {users.length} users
        </div>
      </div>

      <div className="space-y-4">
        {paginatedUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users found</p>
        ) : (
          paginatedUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onUpdateRole={onUpdateRole}
              onDeleteUser={onDeleteUser}
              showMakeAdmin={showMakeAdmin}
              showMakeUser={showMakeUser}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;