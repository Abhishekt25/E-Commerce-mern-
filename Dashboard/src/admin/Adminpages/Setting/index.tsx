import { useEffect } from "react";
import UserList from "./components/UserList";
import CreateUserModal from "./components/CreateUserModal";
import { useUsers } from "./hooks/useUsers";

const Setting = () => {
  const {
    users,
    loading,
    showCreateModal,
    formData,
    setShowCreateModal,
    setFormData,
    fetchUsers,
    handleCreateUser,
    handleUpdateRole,
    handleDeleteUser
  } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const adminUsers = users.filter(user => user.role === "admin");
  const regularUsers = users.filter(user => user.role === "user");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1 md:mt-2">Manage users and their roles</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={fetchUsers}
              className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create New User
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Admin Users Section - With pagination */}
            <UserList
              title="Admin Users"
              users={adminUsers}
              onUpdateRole={handleUpdateRole}
              onDeleteUser={handleDeleteUser}
              badgeColor="bg-red-100 text-red-800"
              badgeText="Admins"
              showMakeUser={true}
              itemsPerPage={5} 
            />

            {/* Regular Users Section - With pagination */}
            <UserList
              title="Regular Users"
              users={regularUsers}
              onUpdateRole={handleUpdateRole}
              onDeleteUser={handleDeleteUser}
              badgeColor="bg-green-100 text-green-800"
              badgeText="Users"
              showMakeAdmin={true}
              itemsPerPage={5} 
            />
          </div>
        )}

        

        {/* Create User Modal */}
        <CreateUserModal
          show={showCreateModal}
          formData={formData}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          onFormDataChange={setFormData}
        />
      </div>
    </div>
  );
};

export default Setting;