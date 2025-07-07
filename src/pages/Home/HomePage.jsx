import React, { useContext, useState, useEffect } from 'react';
import {
  Plane,
  Hotel,
  Car,
  Shield,
  Zap,
  DollarSign,
  Headphones,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Star,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);
  console.log('User from context:', user);
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalHotels: 0,
    totalCars: 0,
    loading: true
  });



  // Statistika məlumatlarını almaq üçün
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Bu API endpointlərinizi əlavə etdikdən sonra aktiv edin
        const [flightsRes, hotelsRes, carsRes] = await Promise.all([
          fetch('https://travel-back-new.onrender.com/api/flights'),
          fetch('https://travel-back-new.onrender.com/api/hotels'),
          fetch('https://travel-back-new.onrender.com/api/cars')
        ]);

        const flightsData = await flightsRes.json();
        const hotelsData = await hotelsRes.json();
        const carsData = await carsRes.json();

        setStats({
          totalFlights: flightsData.count || 0,
          totalHotels: hotelsData.count || 0,
          totalCars: carsData.count || 0,
          loading: false
        });

        // Hələlik statik məlumatlar
        setTimeout(() => {
          setStats({
            totalFlights: flightsData.count || 2847,
            totalHotels: hotelsData.count || 1523,
            totalCars: carsData.count || 896,
            loading: false
          });
        }, 1000);
      } catch (error) {
        console.error('Statistika yüklənmədi:', error);
        setStats({
          totalFlights: 2847,
          totalHotels: 1523,
          totalCars: 896,
          loading: false
        });
      }
    };

    fetchStats();
  }, []);

  const services = [
    {
      title: 'Uçuş Rezervasyonu',
      description: 'Dünyanın hər yerinə ən münasib qiymətlərlə uçuş biletləri',
      icon: Plane,
      link: '/flights',
      color: 'from-blue-500 to-blue-600',
      count: stats.totalFlights
    },
    {
      title: 'Hotel Rezervasyonu',
      description: 'Keyfiyyətli hotellər və ən yaxşı qiymətlər',
      icon: Hotel,
      link: '/hotels',
      color: 'from-emerald-500 to-emerald-600',
      count: stats.totalHotels
    },
    {
      title: 'Avtomobil İcarəsi',
      description: 'Səyahət üçün uyğun və təhlükəsiz avtomobillər',
      icon: Car,
      link: '/cars',
      color: 'from-purple-500 to-purple-600',
      count: stats.totalCars
    },
    {
      title: 'Tur Paketləri',
      description: 'Ən maraqlı və sərfəli turlar, qrup və fərdi seçimlər',
      icon: MapPin,
      link: '/tours',
      color: 'from-pink-500 to-orange-500',
      count: stats.totalTours || 0 // stats.totalTours varsa istifadə et, yoxdursa 0 göstər
    }
  ];
  const features = [
    {
      icon: Shield,
      title: 'Təhlükəsiz Ödəniş',
      description: 'SSL şifrələmə ilə qorunan ödəniş sistemi',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Sürətli Rezervasiya',
      description: 'Dəqiqələr içində rezervasiyanızı tamamlayın',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: DollarSign,
      title: 'Ən Yaxşı Qiymətlər',
      description: 'Bazardakı ən rəqabətli qiymətləri təklif edirik',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Headphones,
      title: '24/7 Dəstək',
      description: 'Hər zaman yanınızdayıq, kömək üçün əlaqə saxlayın',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const quickSearchOptions = [
    {
      icon: Plane,
      title: 'Uçuş Axtar',
      link: '/flights',
      color: 'from-blue-500 to-blue-600',
      description: 'Ən yaxşı uçuş təklifləri'
    },
    {
      icon: Hotel,
      title: 'Hotel Axtar',
      link: '/hotels',
      color: 'from-emerald-500 to-emerald-600',
      description: 'Komfort və keyfiyyət'
    },
    {
      icon: Car,
      title: 'Avtomobil Axtar',
      link: '/cars',
      color: 'from-purple-500 to-purple-600',
      description: 'Sərbəst səyahət'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-32 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-sm animate-pulse delay-700" />
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-purple-500/20 rounded-full blur-sm animate-pulse delay-500" />

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              Səyahət
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Dünyasına
              </span>
              <span className="block text-4xl md:text-6xl font-light opacity-90">
                Xoş Gəlmisiniz
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Uçuş, hotel və avtomobil rezervasyonu üçün ən etibarlı platformaya xoş gəlmisiniz.
              Dünyada hər yerə səyahət edin, xatirələrinizi yaradın.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
              <span className="ml-3 text-lg">Yüklənir...</span>
            </div>
          ) : user ? (
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 inline-block border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-2xl font-semibold">
                    Xoş gəlmisiniz, <span className="text-blue-400">{user.name}</span>!
                  </p>
                  <p className="text-gray-300 mt-1">Səyahət planlaşdırmağa başlayın</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span className="relative z-10">Daxil Ol</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white hover:text-gray-900 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="relative z-10">Qeydiyyat</span>
                <Users className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Xidmətlərimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Səyahətiniz üçün lazım olan hər şey bir yerdə
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Icon Section */}
                  <div className="relative p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {!stats.loading && (
                      <div className="flex items-center mb-6">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-700">
                          {service.count.toLocaleString()}+ seçim mövcuddur
                        </span>
                      </div>
                    )}

                    <Link
                      to={service.link}
                      className={`group/btn inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300`}
                    >
                      <span>İndi Bax</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Niyə Bizi Seçməlisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Müştərilərimizin təhlükəsizliyi və məmnuniyyəti bizim prioritetimizdir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group text-center">
                  <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-2xl group-hover:bg-white/10 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      {user && (
        <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Sürətli Axtarış
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Bir kliklə istədiyiniz xidməti tapın
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {quickSearchOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <Link
                      key={index}
                      to={option.link}
                      className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transform hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-gray-300 mb-6">
                        {option.description}
                      </p>
                      <div className="flex items-center text-white group-hover:text-gray-200 transition-colors">
                        <span className="font-semibold">Başlayın</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.loading ? '...' : stats.totalFlights.toLocaleString()}
              </div>
              <div className="text-lg opacity-90">Uçuş Seçimi</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.loading ? '...' : stats.totalHotels.toLocaleString()}
              </div>
              <div className="text-lg opacity-90">Hotel Seçimi</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.loading ? '...' : stats.totalCars.toLocaleString()}
              </div>
              <div className="text-lg opacity-90">Avtomobil Seçimi</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;