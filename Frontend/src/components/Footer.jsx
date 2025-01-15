import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 py-6">
      <div className="container mx-auto text-center">
        {/* Informative Text */}
        <p className="text-gray-700 text-sm mx-2">
          Seamlessly convert your Word documents to PDFs in just a few clicks. Reliable and user-friendly!
        </p>
        {/* Divider and Copyright */}
        <hr className="border-gray-300 my-4" />
        <p className="text-gray-600 text-xs mx-2">
          © 2025 WordToPDF Converter. All rights reserved. Built with precision and care.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
