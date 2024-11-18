const NotAuthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg mb-6">
          You are not authorized to view this page. Please contact support if
          you believe this is an error.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded shadow hover:bg-gray-200"
        >
          Go Back Login Page
        </a>
      </div>
    </div>
  );
};

export default NotAuthorized;
