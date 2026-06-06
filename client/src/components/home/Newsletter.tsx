import { ArrowRight, MailIcon } from "lucide-react";

const Newsletter = () => {
  return (
    <div className="section bg-white py-18 px-4 sm:px-6 lg:px-8 rounded-3xl mx-auto shadow-xs mt-32 mb-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="size-16 bg-white rounded-xl flex-center mx-auto mb-6 shadow">
          <MailIcon className="size-8 text-app-green" strokeWidth={0.5} />
        </div>
        <h2 className="text-3xl font-semibold text-app-green mb-4">
          Subscribe to our Newsletter
        </h2>
        <p className="text-app-text-light mb-8 text-base">
          Get weekly updates on fresh produce, seasonal offers, and exclusive
          discounts right to your inbox.
        </p>
        <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-xl border border-app-border focus:border-app-green focus:ring bg-white text-sm transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-app-green text-white rounded-xl hover:bg-app-green-dark transition-colors font-semibold flex items-center gap-2"
          >
            Subscribe <ArrowRight className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
