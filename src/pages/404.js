// pages/404.js
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      {/* Apply Link directly to the surrounding container */}
      <Link href="/">Go back to the homepage</Link>
    </div>
  );
};

export default NotFoundPage;
