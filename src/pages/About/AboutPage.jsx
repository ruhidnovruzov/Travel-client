import React from 'react';

const AboutPage = () => {
    return (
        <div className="container pt-20 mx-auto p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[calc(100vh-64px)]">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-800 drop-shadow-lg">Haqqımızda</h2>

                <section className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700">Biz Kimik?</h3>
                    <p className="text-lg leading-relaxed mb-3">
                        <span className="font-semibold text-blue-900">TravelAZ</span> olaraq, səyahət planlaşdırmasını hər kəs üçün asan, əlçatan və xoş etməyi hədəfləyirik. Platformamız uçuşlar, hotellər, turlar və avtomobil icarəsi xidmətlərini bir araya gətirərək, istifadəçilərimizə unudulmaz səyahət təcrübələri yaşatmaq üçün hazırlanıb.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Azərbaycanın aparıcı səyahət platformalarından biri olmaq üçün çalışırıq. Məqsədimiz, səyahətçilərə etibarlı, müxtəlif və rəqabətli qiymətlərlə xidmətlər təqdim etməkdir.
                    </p>
                </section>

                <section className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700">Missiyamız</h3>
                    <p className="text-lg leading-relaxed">
                        Hər bir səyahətçinin ehtiyaclarına cavab verən fərdi və keyfiyyətli səyahət həlləri təklif etməkdir. Bizim üçün səyahət yalnız bir yerə getmək deyil, həm də yeni mədəniyyətləri kəşf etmək, unudulmaz xatirələr yaratmaq və həyatı zənginləşdirməkdir.
                    </p>
                </section>

                <section className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700">Dəyərlərimiz</h3>
                    <ul className="space-y-3">
                        <li>
                            <span className="font-semibold text-blue-800">Müştəri Mərkəzlilik:</span>
                            <span className="ml-2 text-gray-800">İstifadəçilərimizin ehtiyaclarını ön planda tuturuq və onlara ən yaxşı xidməti təqdim etməyə çalışırıq.</span>
                        </li>
                        <li>
                            <span className="font-semibold text-blue-800">Etibarlılıq:</span>
                            <span className="ml-2 text-gray-800">Təqdim etdiyimiz bütün xidmətlərin etibarlı və şəffaf olmasını təmin edirik.</span>
                        </li>
                        <li>
                            <span className="font-semibold text-blue-800">Yenilikçilik:</span>
                            <span className="ml-2 text-gray-800">Səyahət sənayesindəki ən son texnologiyaları və trendləri izləyərək platformamızı daim inkişaf etdiririk.</span>
                        </li>
                        <li>
                            <span className="font-semibold text-blue-800">Müxtəliflik:</span>
                            <span className="ml-2 text-gray-800">Hər kəsin zövqünə və büdcəsinə uyğun geniş çeşiddə səyahət seçimləri təklif edirik.</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700">Bizimlə Səyahət Edin</h3>
                    <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-blue-900">TravelAZ</span> ilə səyahət planlaşdırmaq asan və zövqlüdür. Gəlin, birlikdə dünyanı kəşf edək!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;