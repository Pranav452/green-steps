'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define Zod schema for validation
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Get errors and submitting state
    setError: setFormError, // Function to set manual errors (like API errors)
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), // Use Zod for validation
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // State for API-specific errors (not caught by Zod)
  const [apiError, setApiError] = useState<string | null>(null);

  // Submission handler using react-hook-form
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setApiError(null); // Clear previous API errors
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Login Error:", error.message);
        setApiError(error.message || 'Invalid login credentials.'); // Display API error
        // Optionally set specific field errors if API provides info
        // setFormError("root.serverError", { type: error.code, message: error.message });
        return; // Stop submission on error
      }

      // Successful login
      router.push(redirectTo); // Redirect
      router.refresh(); // Refresh server state if needed

    } catch (error: any) {
      console.error("Unexpected Login Error:", error);
      setApiError('An unexpected error occurred. Please try again.');
    }
    // isSubmitting is handled automatically by react-hook-form
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Login to Green Steps</h2>
      
      {/* Display API errors */} 
      {apiError && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 shadow-sm">
          {apiError}
        </div>
      )}
      
      {/* Use handleSubmit from react-hook-form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")} // Register with react-hook-form
            required
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm ${ 
              errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
            }`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {/* Display Zod validation errors */} 
          {errors.email && (
            <p className="mt-1 text-xs text-red-600" role="alert"> 
              {errors.email.message}
            </p>
          )}
        </div>
        
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")} // Register with react-hook-form
            required
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm ${ 
              errors.password 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
            }`}
             aria-invalid={errors.password ? "true" : "false"}
          />
           {/* Display Zod validation errors */} 
           {errors.password && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        
        {/* Forgot Password Link */} 
        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        {/* Submit Button */} 
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
          className="w-full flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 transition duration-150 ease-in-out"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : 'Login'}
        </button>
      </form>
      
      {/* Link to Register */} 
      <div className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
          Sign up
        </Link>
      </div>
    </div>
  );
} 