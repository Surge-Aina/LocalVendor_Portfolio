import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold">Street Vendor</h1>
      <div className="space-x-4 hidden sm:block">
        <a href="#hero" className="text-gray-600 hover:text-black">
          Home
        </a>
        <a href="#menu" className="text-gray-600 hover:text-black">
          Menu
        </a>
        <a href="#contact" className="text-gray-600 hover:text-black">
          Contact
        </a>
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
