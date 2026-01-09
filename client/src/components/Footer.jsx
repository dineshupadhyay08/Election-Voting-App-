import React from "react";

const Footer = () => {
  return (
    // 👇 hide footer on mobile (bottom nav already exists)
    <footer className="hidden md:block bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">About</h2>
          <p className="text-sm leading-6">
            This digital voting platform is designed for Panchayat elections to
            ensure transparency and fair voting. Powered by Gram Panchayat
            Saadaa.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#home" className="hover:text-green-400">
                Home
              </a>
            </li>
            <li>
              <a href="#live-voting" className="hover:text-green-400">
                Live Voting
              </a>
            </li>
            <li>
              <a href="#candidates" className="hover:text-green-400">
                Candidates
              </a>
            </li>
            <li>
              <a href="#results" className="hover:text-green-400">
                Results
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
          <p className="text-sm">📍 Gram Panchayat Kolasar, Rajasthan</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">✉️ support@panchayatvote.in</p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} Gram Panchayat Voting App. All rights
          reserved.
        </p>
        <p className="text-green-400 mt-1">Made with ❤️ in India 🇮🇳</p>
      </div>
    </footer>
  );
};

export default Footer;
