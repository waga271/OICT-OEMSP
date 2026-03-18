import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f9fafb] dark:bg-[#0d0e12] border-t border-[var(--border)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="EduMERN Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-[var(--text-h)]">EduMERN</span>
            </Link>
            <p className="text-[var(--text)] text-sm leading-relaxed mb-6">
              Empowering learners worldwide through high-quality MERN stack education. Join our community and start your journey today.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholder */}
              {['twitter', 'github', 'linkedin', 'youtube'].map((platform) => (
                <a 
                  key={platform} 
                  href={`#${platform}`} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--social-bg)] text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all duration-300"
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-4 h-4 bg-current rounded-sm opacity-70"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-h)] uppercase tracking-wider mb-6">Platform</h3>
            <ul className="space-y-4">
              {['Courses', 'Instructors', 'Pricing', 'Resources'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-h)] uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-h)] uppercase tracking-wider mb-6">Legal</h3>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-[var(--text)]">
            &copy; {currentYear} EduMERN Platform. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-[var(--text)]">
            <span className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span>Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
