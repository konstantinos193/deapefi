import { Twitter } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import Image from 'next/image';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

export default function AppFooter() {
  return (
    <footer className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-gray-300 py-2 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="https://i.imgur.com/5QhVrb8.png" alt="Logo" width={40} height={40} />
            <span className="text-lg md:text-2xl font-bold text-white">
              <span className="text-[#0154fa]">DeApe</span>.fi
            </span>
          </div>
          <div className="flex space-x-4 items-center">
            <SocialLink 
              href="https://x.com/ApeEliteClub" 
              icon={<Twitter size={18} />}
            />
            <SocialLink 
              href="https://discord.gg/apeeliteclub" 
              icon={<FaDiscord size={18} />}
            />
          </div>
        </div>
        <div className="hidden md:flex justify-center mt-8 pt-8 border-t border-gray-700 text-sm">
          <div className="text-center">
            <p>&copy; 2025 DeApe.fi. All rights reserved.</p>
            <p className="mt-2 text-gray-400">DeApe.fi is currently in beta. Only staking features are available at this time.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors"
    >
      {icon}
    </a>
  );
}
