import Navbar from './NavBar';

/**
 * Layout component that wraps other components with a common layout.
 * Currently, it only includes the Navbar component.
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout = () => {
  return (
    <>
      <Navbar />
    </>
  );
};

export default Layout;
