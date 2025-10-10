import backgroundImage from "../../assets/home/hero/background.jpg";
import chargingdocImage from "../../assets/home/hero/chargingdoc.jpg";

const Home = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 brightness-75"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-purple-900/70 to-transparent z-1"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 text-center md:text-left">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text Section */}
          <div className="flex-1 min-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Power Your <br />
              <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Electric Journey
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-300 max-w-2xl leading-relaxed">
              Discover premium EV charging stations, reserve your charging window instantly, 
              and stay powered for the road ahead. Intelligent. Rapid. Sustainable.
            </p>

            <div className="mt-12 flex flex-wrap gap-8 justify-center md:justify-start">
              <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 border border-amber-500/30">
                Start Charging
              </button>
              <button className="px-10 py-4 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900 font-bold rounded-2xl transition-all duration-300 transform hover:scale-110">
                Explore Network
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 flex flex-wrap justify-center md:justify-start gap-12">
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">200+</div>
                <div className="text-lg text-gray-400 font-medium">Charging Hubs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-lg text-gray-400 font-medium">Smart Booking</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">Zero</div>
                <div className="text-lg text-gray-400 font-medium">Carbon Footprint</div>
              </div>
            </div>
          </div>

          {/* Illustration / Image */}
          <div className="flex-1 hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-amber-600 rounded-3xl blur-xl opacity-30"></div>
              <img
                src={chargingdocImage}
                alt="EV Charging Infrastructure"
                className="relative rounded-2xl shadow-2xl w-4/5 object-cover border border-amber-500/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-8 h-12 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 left-10 w-4 h-4 bg-amber-400 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-purple-600 rounded-full opacity-10 animate-ping"></div>
    </section>
  );
};

export default Home;