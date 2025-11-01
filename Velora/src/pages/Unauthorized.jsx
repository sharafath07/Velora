import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <ShieldX className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              This page requires special permissions that your account doesn't have.
            </p>
            
            <div className="space-y-3">
              <Link to="/" className="block">
                <Button className="w-full">
                  <Home size={16} className="mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              
              <Link to="/dashboard" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                If you believe this is an error, please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;