'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                    placeholder="john@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                    placeholder="+1 (305) 555-0123"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                    required
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                    placeholder="Tell us about your event..."
                />
            </div>

            <button
                disabled={status === 'sending'}
                type="submit"
                className="w-full py-4 bg-navy text-white font-bold rounded hover:bg-navy-light transition-colors disabled:opacity-70 uppercase tracking-widest text-sm"
            >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && <p className="text-green-600 text-center font-medium">Message sent successfully!</p>}
        </form>
    );
}
