import React from 'react';

const HealthPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Xray Setu Frontend</h1>
        <p className="text-green-600 font-semibold">✅ Healthy</p>
        <p className="text-gray-600 mt-2">Frontend is running successfully</p>
      </div>
    </div>
  );
};

export default HealthPage;