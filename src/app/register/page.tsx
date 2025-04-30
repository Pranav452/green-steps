import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Green Steps',
  description: 'Create your Green Steps account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <RegisterForm />
    </div>
  );
} 