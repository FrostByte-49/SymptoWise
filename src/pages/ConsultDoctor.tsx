import React, { useEffect, useState, useMemo } from "react";
import {
  Stethoscope,
  MapPin,
  Loader2,
  Phone,
  ExternalLink,
  User,
  AlertTriangle,
  ChevronDown,
  Search,
  Video,
  Map,
} from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  location: string;
  experience: string;
  contact: string;
  available: string;
  image?: string;
  hospital?: string;
  hospital_link?: string;
  google_maps?: string;
  qualification?: string;
  rating?: number;
};

const OpenStreetMap: React.FC<{ userLocation: { lat: number; lng: number } | null }> = ({ userLocation }) => {
  if (!userLocation) {
    return (
      <div className="h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  // Calculate bounding box (10km around user location)
  const getBoundingBox = (lat: number, lng: number, distanceKm: number) => {
    const radius = distanceKm / 111.32; // Approx km per degree
    return [
      lng - radius, // minLongitude
      lat - radius, // minLatitude
      lng + radius, // maxLongitude
      lat + radius  // maxLatitude
    ];
  };

  const [minLon, minLat, maxLon, maxLat] = getBoundingBox(userLocation.lat, userLocation.lng, 10);
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;

  return (
    <div className="h-96 rounded-xl overflow-hidden">
      <iframe
        title="Healthcare Facilities Map"
        className="w-full h-full border-0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`}
        allowFullScreen
      />
    </div>
  );
};

const ConsultDoctorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"doctors" | "online" | "nearby">("doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [specializationSearch, setSpecializationSearch] = useState<string>("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSpecializationOpen, setIsSpecializationOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        () => {
          setLocationError("Could not access your location. Using default coordinates.");
          // Default to Mumbai coordinates if location access is denied
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setUserLocation({ lat: 19.0760, lng: 72.8777 }); // Default fallback
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/assets/json/doctors.json")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setFilteredDoctors(data);
      })
      .catch((err) => console.error("Failed to load doctors:", err));
  }, []);

  // Get filtered locations and specializations
  const filteredLocations = useMemo(() => {
    const allLocations = ["All", ...new Set(doctors.map((doc) => doc.location))];
    return allLocations.filter((location) =>
      location.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [doctors, locationSearch]);

  const filteredSpecializations = useMemo(() => {
    const allSpecializations = ["All", ...new Set(doctors.map((doc) => doc.specialization))];
    return allSpecializations.filter((spec) =>
      spec.toLowerCase().includes(specializationSearch.toLowerCase())
    );
  }, [doctors, specializationSearch]);

  // Filter doctors based on selections
  useEffect(() => {
    let result = doctors;

    if (selectedLocation !== "All") {
      result = result.filter((doc) => doc.location.includes(selectedLocation));
    }

    if (selectedSpecialization !== "All") {
      result = result.filter((doc) => doc.specialization === selectedSpecialization);
    }

    if (searchQuery) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hospital?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(result);
  }, [selectedLocation, selectedSpecialization, searchQuery, doctors]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2 mt-0 text-gray-800 dark:text-white">
        <span className='text-primary-600 dark:text-primary-400'>Medical</span>
        <span className='text-accent-600 dark:text-accent-400'> Consultation</span>
      </h1>

      <p className="text-center mb-10 text-gray-600 dark:text-gray-300 max-w-xl mx-auto capitalize">
        Connect with healthcare professionals through your preferred method
      </p>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={() => setActiveTab("doctors")}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "doctors"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <User size={20} />
          <span className="font-medium">Find Doctors</span>
        </button>

        <button
          onClick={() => setActiveTab("online")}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "online"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Video size={20} />
          <span className="font-medium">Online Consultation</span>
        </button>

        <button
          onClick={() => setActiveTab("nearby")}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "nearby"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Map size={20} />
          <span className="font-medium">Clinics Nearby</span>
        </button>
      </div>

      {/* Doctors Tab */}
      {activeTab === "doctors" && (
        <div className="space-y-8">
          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search doctors, hospitals..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Location Dropdown with Search */}
              <div className="relative">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full flex justify-between items-center px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>{selectedLocation}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isLocationOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isLocationOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-700 p-2 border-b border-gray-200 dark:border-gray-600">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search locations..."
                          className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredLocations.length > 0 ? (
                        filteredLocations.map((location) => (
                          <div
                            key={location}
                            className={`px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer ${
                              selectedLocation === location
                                ? "bg-blue-100 dark:bg-gray-600"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedLocation(location);
                              setIsLocationOpen(false);
                              setLocationSearch("");
                            }}
                          >
                            {location}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                          No Locations Found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Specialization Dropdown with Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSpecializationOpen(!isSpecializationOpen)}
                  className="w-full flex justify-between items-center px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>{selectedSpecialization}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isSpecializationOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isSpecializationOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-700 p-2 border-b border-gray-200 dark:border-gray-600">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search specializations..."
                          className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                          value={specializationSearch}
                          onChange={(e) => setSpecializationSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredSpecializations.length > 0 ? (
                        filteredSpecializations.map((spec) => (
                          <div
                            key={spec}
                            className={`px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer ${
                              selectedSpecialization === spec
                                ? "bg-blue-100 dark:bg-gray-600"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedSpecialization(spec);
                              setIsSpecializationOpen(false);
                              setSpecializationSearch("");
                            }}
                          >
                            {spec}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                          No Specializations Found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredDoctors.length} Doctors
            {selectedLocation !== "All" && ` in ${selectedLocation}`}
            {selectedSpecialization !== "All" && ` specializing in ${selectedSpecialization}`}
          </div>

          {/* Doctor Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col p-5 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-md transition h-full border border-gray-300 dark:border-gray-700"
                >
                  {/* Doctor Image */}
                  {doc.image && (
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-30 object-cover rounded-lg mb-4 border border-gray-100 dark:border-gray-800"
                      loading="lazy"
                    />
                  )}

                  {/* Doctor Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-2">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-1">
                        {doc.name}
                      </h2>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {doc.specialization}
                      </p>
                    </div>

                    {/* Rating */}
                    {doc.rating && (
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(doc.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({doc.rating?.toFixed(1)})
                        </span>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-start">
                        <MapPin
                          size={16}
                          className="flex-shrink-0 mt-0.5 mr-2 text-gray-400 dark:text-gray-500"
                        />
                        <span className="line-clamp-2">
                          {doc.hospital}, {doc.location}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <User
                          size={16}
                          className="flex-shrink-0 mt-0.5 mr-2 text-gray-400 dark:text-gray-500"
                        />
                        <div>
                          <p>{doc.experience}</p>
                          {doc.qualification && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {doc.qualification}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone
                          size={16}
                          className="flex-shrink-0 mt-0.5 mr-2 text-gray-400 dark:text-gray-500"
                        />
                        <span>{doc.contact}</span>
                      </div>

                      <div className="flex items-start">
                        <Stethoscope
                          size={16}
                          className="flex-shrink-0 mt-0.5 mr-2 text-gray-400 dark:text-gray-500"
                        />
                        <span>{doc.available}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <a
                        href={doc.hospital_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-2 rounded flex items-center justify-center gap-1 border border-blue-100 dark:border-blue-800/50"
                      >
                        <ExternalLink size={14} /> Hospital
                      </a>
                      <a
                        href={doc.google_maps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-sm bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-2 rounded flex items-center justify-center gap-1 border border-green-100 dark:border-green-800/50"
                      >
                        <MapPin size={14} /> Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                No Doctors Found Matching Your Criteria
              </div>
            )}
          </div>
        </div>
      )}

      {/* Online Consultation Tab */}
      {activeTab === "online" && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              <Video className="inline mr-2" size={20} />
              Virtual Healthcare Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect with licensed doctors via video call from the comfort of
              your home. Available 24/7 for non-emergency consultations.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Practo",
                  desc: "Instant video consultation with specialists",
                  link: "https://www.practo.com/",
                  color: "bg-blue-100 text-blue-800",
                },
                {
                  name: "1mg",
                  desc: "Affordable online doctor consultations",
                  link: "https://www.1mg.com/online-doctor-consultation",
                  color: "bg-purple-100 text-purple-800",
                },
                {
                  name: "Apollo 24|7",
                  desc: "Consult Apollo hospital doctors online",
                  link: "https://www.apollo247.com/",
                  color: "bg-red-100 text-red-800",
                },
                {
                  name: "MFine",
                  desc: "AI-powered health assistant + doctors",
                  link: "https://www.mfine.co/",
                  color: "bg-green-100 text-green-800",
                },
                {
                  name: "DocsApp",
                  desc: "Specialist doctors in 15 mins",
                  link: "https://www.docsapp.com/",
                  color: "bg-yellow-100 text-yellow-800",
                },
                {
                  name: "Lybrate",
                  desc: "Chat/video with verified doctors",
                  link: "https://www.lybrate.com/",
                  color: "bg-indigo-100 text-indigo-800",
                },
              ].map((service) => (
                <a
                  key={service.name}
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-xl hover:shadow-md transition ${service.color}`}
                >
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-sm opacity-80">{service.desc}</p>
                  <div className="mt-3 text-xs flex items-center gap-1">
                    <ExternalLink size={12} />
                    Visit platform
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nearby Clinics Tab */}
      {activeTab === "nearby" && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              <Map className="inline mr-2" size={20} />
              Find Healthcare Facilities Near You
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Locate nearby hospitals, clinics, and pharmacies with emergency
              services availability.
            </p>

            {locationError && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <AlertTriangle className="text-yellow-500 dark:text-yellow-300 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {locationError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Interactive Map
                </h3>
                {locationLoading ? (
                  <div className="h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                  </div>
                ) : (
                  <OpenStreetMap userLocation={userLocation} />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  * Enable location access for precise results
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Emergency Contacts
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Ambulance", number: "108", icon: "🚑" },
                    { name: "Police", number: "100", icon: "👮" },
                    { name: "COVID Helpline", number: "1075", icon: "🦠" },
                    { name: "Mental Health", number: "9152987821", icon: "🧠" },
                    {
                      name: "Poison Control",
                      number: "1800-116-117",
                      icon: "⚠️",
                    },
                    { name: "Women's Helpline", number: "1091", icon: "👩" },
                  ].map((contact) => (
                    <div
                      key={contact.name}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-2xl mr-3">{contact.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.number}
                        </p>
                      </div>
                      <a
                        href={`tel:${contact.number}`}
                        className="bg-white dark:bg-gray-600 p-2 rounded-full shadow-sm"
                      >
                        <Phone size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Banner (Fixed at bottom) */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="#emergency"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse"
        >
          <AlertTriangle size={18} />
          <span>Emergency</span>
        </a>
      </div>
    </div>
  );
};

export default ConsultDoctorPage;
