
import Footer from '@/components/Footer';

export default function About() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-8 font-work-sans">
        <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to <strong>Buy Smartly</strong>, your one-stop destination for smart shopping. We believe shopping should be simple, enjoyable, and smart—helping you make informed choices for products that matter to you.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-4">
          At <strong>Buy Smartly</strong>, we are on a mission to redefine online shopping. By offering a curated selection of quality products at competitive prices, we aim to create a seamless shopping experience tailored to your needs.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
          <li><strong>Top-Quality Products:</strong> We ensure every product meets the highest standards of quality and reliability.</li>
          <li><strong>Customer-Centric Approach:</strong> Your satisfaction is our priority. Our team is dedicated to addressing your needs and concerns.</li>
          <li><strong>Smart Deals & Savings:</strong> Enjoy exciting discounts, exclusive deals, and value-packed offers across all categories.</li>
          <li><strong>Fast & Secure:</strong> We ensure timely delivery and secure transactions, so you can shop with confidence.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Our Story</h2>
        <p className="text-lg text-gray-700 mb-4">
          Born out of a passion for innovation and a commitment to customer satisfaction, <strong>Buy Smartly</strong> was founded to bring convenience, affordability, and reliability to the world of online shopping. Over time, we have grown into a trusted platform for smart shoppers like you.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Join Our Journey</h2>
        <p className="text-lg text-gray-700 mb-4">
          We are more than just an e-commerce platform—we are a community of smart shoppers who value quality, trust, and innovation. Thank you for choosing <strong>Buy Smartly</strong>, and we look forward to serving you better every day.
        </p>
      </main>
      <Footer />
    </>
  );
}
