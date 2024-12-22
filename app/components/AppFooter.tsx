import { Twitter } from 'lucide-react'; // import Twitter icon

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

export default function AppFooter() {
  return (
    <footer className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <span className="text-2xl font-bold text-white">
              <span className="text-[#0154fa]">DeApe</span>.fi
            </span>
            <p className="text-sm mt-2">Revolutionizing NFT finance on the Ape blockchain.</p>
          </div>
          <div className="flex space-x-6">
            <SocialLink 
              href="https://x.com/ApeEliteClub" 
              icon={<Twitter size={20} />} // fixed Twitter icon usage
            />
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; 2024 DeApe.fi. All rights reserved.</p>
          <p className="mt-2 text-gray-400">DeApe.fi is currently in beta. Only staking features are available at this time.</p>
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
