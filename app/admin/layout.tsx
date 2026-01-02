import type { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Canarische Eilanden',
  description: 'Beheer uw content en instellingen',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
