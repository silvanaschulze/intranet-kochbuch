import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} Intranet-Kochbuch. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
