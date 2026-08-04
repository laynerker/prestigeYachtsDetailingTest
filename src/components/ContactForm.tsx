'use client';
import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

function ContactFormContent() {
    const searchParams = useSearchParams();
    const service = searchParams.get('service');
    const t = useTranslations('Contact');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    useEffect(() => {
        if (service) {
            setFormData(prev => ({
                ...prev,
                message: t('defaultMessage', { service })
            }));
        }
    }, [service, t]);

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.firstName,
                    apellido: formData.lastName,
                    correo: formData.email,
                    telefono: formData.phone,
                    mensaje: formData.message
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
                // Reset status after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('firstName')}</label>
                    <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:border-teak focus:ring-1 focus:ring-teak outline-none transition-all"
                        placeholder={t('placeholderFirstName')}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('lastName')}</label>
                    <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded border border-gray-300 focus:border-teak focus:ring-1 focus:ring-teak outline-none transition-all"
                        placeholder={t('placeholderLastName')}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-teak focus:ring-1 focus:ring-teak outline-none transition-all"
                    placeholder={t('placeholderEmail')}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
                <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-teak focus:ring-1 focus:ring-teak outline-none transition-all"
                    placeholder={t('placeholderPhone')}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('message')}</label>
                <textarea
                    required
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:border-teak focus:ring-1 focus:ring-teak outline-none transition-all"
                    placeholder={t('placeholderMessage')}
                />
            </div>

            <button
                disabled={status === 'sending'}
                type="submit"
                className="w-full py-4 bg-slipway text-gelcoat font-bold rounded hover:bg-bilge transition-colors disabled:opacity-70 uppercase tracking-widest text-sm"
            >
                {status === 'sending' ? t('sending') : t('send')}
            </button>

            {status === 'success' && <p className="text-green-600 text-center font-medium">{t('success')}</p>}
            {status === 'error' && <p className="text-red-600 text-center font-medium">{t('error')}</p>}
        </form>
    );
}

export default function ContactForm() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <ContactFormContent />
        </Suspense>
    );
}
