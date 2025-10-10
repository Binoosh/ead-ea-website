import { useState } from "react";
import backgroundImage from "../../assets/home/hero/background.jpg";
import station1 from "../../assets/stations/station1.jpg";
import station2 from "../../assets/stations/station2.jpg";
import station3 from "../../assets/stations/station3.jpg";
import station4 from "../../assets/stations/station4.jpg";
import station5 from "../../assets/stations/station5.jpg";
import station6 from "../../assets/stations/station6.jpg";

export default function EVChargingStations() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [filter, setFilter] = useState("all");

  // Dummy data for charging stations
  const stations = [
    {
      id: 1,
      name: "Downtown Super",
      image: station1,
      type: "DC Fast Charging",
      power: "150 kW",
      slots: 8,
      available: 5,
      price: "$0.35/kWh",
      address: "123 Main Street, Downtown",
      hours: "24/7",
      amenities: ["Cafe", "Restrooms", "WiFi", "Shopping"],
      rating: 4.8,
      reviews: 1247,
    },
    {
      id: 2,
      name: "Mall Charging Hub",
      image: station2,
      type: "Type 2 AC",
      power: "22 kW",
      slots: 12,
      available: 8,
      price: "$0.25/kWh",
      address: "456 Shopping Mall, City Center",
      hours: "6:00 AM - 11:00 PM",
      amenities: ["Shopping", "Food Court", "Restrooms"],
      rating: 4.5,
      reviews: 892,
    },
    {
      id: 3,
      name: "Express Charge",
      image: station3,
      type: "DC Fast Charging",
      power: "350 kW",
      slots: 6,
      available: 2,
      price: "$0.45/kWh",
      address: "Highway Exit 45, Service Plaza",
      hours: "24/7",
      amenities: ["Restaurant", "Restrooms", "Convenience Store"],
      rating: 4.7,
      reviews: 1563,
    },
    {
      id: 4,
      name: "Eco Park Station",
      image: station4,
      type: "Solar Charging",
      power: "50 kW",
      slots: 4,
      available: 3,
      price: "$0.20/kWh",
      address: "789 Green Park, Eco District",
      hours: "5:00 AM - 10:00 PM",
      amenities: ["Park", "Walking Trails", "Cafe"],
      rating: 4.9,
      reviews: 734,
    },
    {
      id: 5,
      name: "Tech Charger",
      image: station5,
      type: "DC Fast Charging",
      power: "120 kW",
      slots: 10,
      available: 6,
      price: "$0.30/kWh",
      address: "101 Innovation Drive, Tech Park",
      hours: "24/7",
      amenities: ["WiFi", "Lounge", "Conference Rooms"],
      rating: 4.6,
      reviews: 543,
    },
    {
      id: 6,
      name: "Beachside Charging",
      image: station6,
      type: "Type 2 AC",
      power: "11 kW",
      slots: 6,
      available: 4,
      price: "$0.28/kWh",
      address: "234 Coastal Highway, Beachfront",
      hours: "6:00 AM - 10:00 PM",
      amenities: ["Beach Access", "Restaurants", "Showers"],
      rating: 4.4,
      reviews: 678,
    },
  ];

  const filters = [
    { id: "all", label: "All Stations" },
    { id: "fast", label: "Fast Charging" },
    { id: "solar", label: "Solar Powered" },
    { id: "available", label: "Available Now" },
  ];

  const filteredStations = stations.filter((station) => {
    if (filter === "all") return true;
    if (filter === "fast") return station.type.includes("Fast");
    if (filter === "solar") return station.type.includes("Solar");
    if (filter === "available") return station.available > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section - Matching Home Page Theme */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 brightness-75"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-purple-900/70 to-transparent z-1"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
            EV Charging <br />
            <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
              Stations
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our premium network of reliable, fast, and conveniently located 
            EV charging stations. Intelligent. Rapid. Sustainable.
          </p>

          {/* Quick Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-12">
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

      {/* Filters */}
      <section className="py-12 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  filter === filterItem.id
                    ? "bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-2xl"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-amber-500/30"
                }`}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stations Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-amber-500/20"
                onClick={() => setSelectedStation(station)}
              >
                <div className="relative">
                  <img
                    src={station.image}
                    alt={station.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {station.available} Available
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {station.type}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {station.name}
                    </h3>
                    <div className="flex items-center bg-purple-900/50 text-amber-400 px-3 py-1 rounded-full text-sm font-bold border border-amber-400/30">
                      ⭐ {station.rating} ({station.reviews})
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4 text-sm">{station.address}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-300">Power:</span>
                      <div className="text-amber-400 font-bold">{station.power}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300">Price:</span>
                      <div className="text-green-400 font-bold">
                        {station.price}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300">Slots:</span>
                      <div className="text-gray-400">{station.slots} total</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300">Hours:</span>
                      <div className="text-gray-400 text-xs">{station.hours}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {station.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-amber-300 px-3 py-1 rounded-full text-xs border border-amber-400/20"
                      >
                        {amenity}
                      </span>
                    ))}
                    {station.amenities.length > 3 && (
                      <span className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full text-xs border border-gray-600">
                        +{station.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-amber-500/30 shadow-2xl">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Station Detail Modal */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30 shadow-2xl">
            <div className="relative">
              <img
                src={selectedStation.image}
                alt={selectedStation.name}
                className="w-full h-72 object-cover"
              />
              <button
                onClick={() => setSelectedStation(null)}
                className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black transition-all duration-300 border border-amber-400/30"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6">
                <div className="bg-gradient-to-r from-purple-600 to-amber-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {selectedStation.available} slots available
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-4xl font-black text-white">
                  {selectedStation.name}
                </h2>
                <div className="text-right">
                  <div className="flex items-center text-amber-400 font-bold text-lg">
                    ⭐ {selectedStation.rating} ({selectedStation.reviews}{" "}
                    reviews)
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                    Station Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Charger Type:</span>
                      <span className="font-bold text-amber-400">
                        {selectedStation.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Power Output:</span>
                      <span className="font-bold text-amber-400">
                        {selectedStation.power}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Price:</span>
                      <span className="font-bold text-green-400 text-lg">
                        {selectedStation.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Operating Hours:</span>
                      <span className="font-bold text-white">
                        {selectedStation.hours}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                    Location & Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 block mb-2">Address:</span>
                      <p className="font-bold text-white text-lg">{selectedStation.address}</p>
                    </div>
                    <div className="bg-gray-700 rounded-2xl h-40 flex items-center justify-center border border-amber-500/20">
                      <div className="text-center text-gray-400">
                        <div className="text-3xl mb-3">🗺️</div>
                        <p className="font-semibold">Interactive Map</p>
                        <p className="text-sm mt-1">Get real-time directions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                  Premium Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedStation.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 p-4 rounded-2xl text-center border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300"
                    >
                      <div className="text-amber-400 font-semibold">{amenity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-amber-500/30 shadow-2xl">
                  Book Charging Slot
                </button>
                <button className="flex-1 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900 font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}