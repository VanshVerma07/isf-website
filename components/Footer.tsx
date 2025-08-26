
import React from 'react';
import { LinkedInIcon, InstagramIcon, GithubIcon } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border-t border-gray-200/10 dark:border-gray-800/10 mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="font-orbitron text-xl font-bold text-secondary dark:text-white">ISF BKBIET Pilani</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fostering Innovation in Electronics & Telecommunication.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><LinkedInIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><InstagramIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors"><GithubIcon className="h-6 w-6" /></a>
          </div>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
          <p>&copy; {new Date().getFullYear()} ISF BKBIET Pilani. All Rights Reserved.</p>
          <p>A modern, fast, mobile-optimized, and fully admin-controlled platform.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
