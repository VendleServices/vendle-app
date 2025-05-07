import { ReactNode } from 'react';
import Navbar from './Navbar';

interface MyProjectsLayoutProps {
  children: ReactNode;
}

const MyProjectsLayout = ({ children }: MyProjectsLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MyProjectsLayout; 