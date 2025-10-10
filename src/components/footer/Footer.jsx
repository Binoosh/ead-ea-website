// src/components/AppFooter.jsx
import { Link } from "react-router-dom";
import { Bolt } from "lucide-react";
import { FaPhoneAlt, FaEnvelopeOpenText, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function AppFooter() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Simulating API-based links (can be replaced with real backend call)
    setLinks([
      { name: "Home", path: "/" },
      { name: "Stations", path: "/stations" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ]);
  }, []);

  const supportItems = [
    { label: "Help Center" },
    { label: "Privacy Policy" },
    { label: "Terms of Use" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Branding Section */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 mb-3 text-2xl font-semibold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent"
          >
            <Bolt className="text-sky-400 h-6 w-6" />
            EVChargeHub
          </Link>
          <p className="text-sm leading-relaxed">
            EVChargeHub bridges the gap between electric vehicle drivers and
            charging operators — making sustainable mobility effortless.
          </p>
        </div>

        {/* Navigation and Support */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between gap-10 md:gap-8">
          <div>
            <h3 className="text-white font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-sky-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Support</h3>
            <ul className="space-y-2">
              {supportItems.map((s) => (
                <li
                  key={s.label}
                  className="hover:text-sky-400 cursor-pointer transition-colors"
                >
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-white font-medium mb-3">Reach Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-sky-400" />
              <span>+94 71 088 2436</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelopeOpenText className="text-sky-400" />
              <span>support@evchargehub.lk</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-sky-400" />
              <span>Colombo, Sri Lanka</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EVChargeHub — Empowering Smarter Mobility.
      </div>
    </footer>
  );
}
