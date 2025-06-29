import React, { useState } from 'react';
import { Clock, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    try {
      fetch('https://time-rent-production.up.railway.app/api/v1/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          details: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password
          }
        })
      }).then(async (response: Response) => {
        const data = await response.json()
        if (data.token) {
          navigate('/signin')
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
          })
          toast.success('Signed up succesfully')
        } else {
          toast.error(data.message)
        }
      })
    } catch (error) {
      toast.error('Something went wrong')
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Toaster/>
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
              TimeRent
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join thousands earning from their time
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="name"
                name="first_name"
                type="text"
                autoComplete="name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="name"
                name="last_name"
                type="text"
                autoComplete="name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${
                    formData.confirmPassword && !passwordsMatch 
                      ? 'border-red-300' 
                      : passwordsMatch 
                        ? 'border-green-300' 
                        : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                  {passwordsMatch && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div> */}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-green-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <p onClick={() => navigate('/signin')} className="inline text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer">
                Sign in
              </p>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why join TimeRent?</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Check className="w-5 h-5 text-green-500 mr-3" />
              <span>Set your own rates and schedule</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Check className="w-5 h-5 text-green-500 mr-3" />
              <span>Get paid instantly after each session</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Check className="w-5 h-5 text-green-500 mr-3" />
              <span>Build your professional reputation</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Check className="w-5 h-5 text-green-500 mr-3" />
              <span>No long-term commitments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;