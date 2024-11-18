import { useState } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
const SettingsPage = () => {
  const user = useSelector((state) => state.user);
  console.log("user : ", user);
  const [userData, setUserData] = useState(user);

  const [editData, setEditData] = useState({ ...userData });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveChanges = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const formatDate = (intDate) => {
    // Create a new Date object from the Unix timestamp (milliseconds are required)
    let date = new Date(intDate * 1000); // Multiply by 1000 to convert to milliseconds

    // Extract parts for custom format (DD-MM-YYYY HH:mm)
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");

    // Custom format: DD-MM-YYYY HH:mm
    let formattedDate = `${day}-${month}-${year} at ${hours}:${minutes}`;

    return formattedDate;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <NavBar />

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 mt-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Settings</h1>
        <div className="space-y-4">
          {/* User Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={editData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-1 px-4 py-2 border rounded-md ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={editData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-1 px-4 py-2 border rounded-md ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-1 px-4 py-2 border rounded-md ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Joined
            </label>
            <input
              type="text"
              name="date_joined"
              value={formatDate(editData.date_joined)}
              onChange={handleInputChange}
              disabled
              className={`w-full mt-1 px-4 py-2 border rounded-md ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={saveChanges}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
              <button
                onClick={cancelChanges}
                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={() => console.log("Logged out")}
            className="ml-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
