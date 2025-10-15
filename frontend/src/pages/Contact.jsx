import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg">
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
              <textarea 
                id="message"
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="Your message"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;