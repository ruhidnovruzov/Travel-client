import React, { useState } from 'react';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const response = await fetch('https://travel-back-new.onrender.com/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });
            await response.json();
            if (response.ok) {
                setSubmitStatus('success');
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
            } else {
                setSubmitStatus('error');
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (error) {
            setSubmitStatus('error');
        }
    };

    return (
        <div className="container pt-20 mx-auto p-6 bg-gradient-to-br min-h-[calc(100vh-64px)]">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-w-2xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-800 drop-shadow-lg">Əlaqə</h2>

                <p className="text-lg leading-relaxed text-center mb-10 text-gray-700">
                    Hər hansı bir sualınız, təklifiniz və ya rəyiniz varsa, aşağıdakı formu doldurun. Komandamız ən qısa zamanda sizinlə əlaqə saxlayacaq.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Adınız</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Adınız"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">Mövzu</label>
                        <input
                            type="text"
                            id="subject"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Mövzu"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">Mesajınız</label>
                        <textarea
                            id="message"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
                            rows="5"
                            placeholder="Mesajınızı buraya yazın..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {submitStatus === 'loading' && (
                        <p className="text-center text-indigo-600 font-semibold">Göndərilir...</p>
                    )}
                    {submitStatus === 'success' && (
                        <p className="text-center text-green-600 font-semibold">Mesajınız uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.</p>
                    )}
                    {submitStatus === 'error' && (
                        <p className="text-center text-red-600 font-semibold">Mesajınızı göndərərkən xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
                        disabled={submitStatus === 'loading'}
                    >
                        Göndər
                    </button>
                </form>

                <div className="mt-14 text-center text-gray-700">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700">Əlaqə Məlumatlarımız</h3>
                    <div className="space-y-2 text-lg">
                        <div>
                            <span className="font-semibold text-blue-800">Ünvan:</span>
                            <span className="ml-2">Bakı, Azərbaycan</span>
                        </div>
                        <div>
                            <span className="font-semibold text-blue-800">Telefon:</span>
                            <span className="ml-2">+994 50 123 45 67</span>
                        </div>
                        <div>
                            <span className="font-semibold text-blue-800">Email:</span>
                            <span className="ml-2">info@travelaz.com</span>
                        </div>
                        <div>
                            <span className="font-semibold text-blue-800">İş Saatları:</span>
                            <span className="ml-2">Bazar ertəsi - Cümə: 09:00 - 18:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;