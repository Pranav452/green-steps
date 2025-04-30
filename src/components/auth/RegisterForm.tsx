'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define Zod schema with password confirmation
const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Set the error on the confirmPassword field
});

// Infer the type from the schema
type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const { supabase } = useSupabase();
  const router = useRouter();
  
  // State for API errors or success messages
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Function to reset the form
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Submission handler using react-hook-form
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setApiError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Registration Error:", error.message);
        setApiError(error.message || 'An error occurred during registration.');
        return;
      }

      // Success
      setSuccessMessage('Registration successful! Please check your email to confirm your account.');
      reset(); // Clear the form fields
      // Redirect after a delay (optional, could just show message)
      setTimeout(() => {
         router.push('/login');
      }, 5000);

    } catch (error: any) {
      console.error("Unexpected Registration Error:", error);
      setApiError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Create Account</h2>
      
      {/* Display API errors */} 
      {apiError && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 shadow-sm">
          {apiError}
        </div>
      )}
      
      {/* Display Success Message */} 
      {successMessage && (
        <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700 shadow-sm">
          {successMessage}
        </div>
      )}
      
      {/* Don't show form if registration was successful */} 
      {!successMessage && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              required
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm ${ 
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
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
              {...register("password")}
              required
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm ${ 
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              }`}
               aria-invalid={errors.password ? "true" : "false"}
            />
             {errors.password && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          
          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              required
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm ${ 
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              }`}
               aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
             {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          
          {/* Submit Button */} 
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 transition duration-150 ease-in-out"
          >
             {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : 'Register'}
          </button>
        </form>
      )}
      
      {/* Link to Login */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
          Sign in
        </Link>
      </div>
    </div>
  );
} 