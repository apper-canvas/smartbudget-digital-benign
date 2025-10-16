import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import ApperIcon from '@/components/ApperIcon';

function Signup() {
  const navigate = useNavigate();
  const { isInitialized } = useAuth();
  
  useEffect(() => {
    if (isInitialized && window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication-signup");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white text-2xl font-bold">
            <ApperIcon name="Wallet" className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-500">
              Join SmartBudget to manage your finances
            </div>
          </div>
        </div>
        <div id="authentication-signup" />
        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;