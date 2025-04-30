import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Green Steps',
  description: 'Log in to your Green Steps account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <LoginForm />
    </div>
  );
} 