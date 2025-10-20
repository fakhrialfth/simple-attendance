'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, Clock, AlertCircle, X, ExternalLink } from 'lucide-react';
import { store } from '@/routes/attendance';

interface FormData {
    name: string;
    photo: File | null;
    latitude: number;
    longitude: number;
    notes: string;
}

interface FormErrors {
    name?: string[];
    photo?: string[];
    latitude?: string[];
    longitude?: string[];
    notes?: string[];
}

interface Toast {
    id: string;
    message: string;
    type: 'error' | 'success' | 'warning';
}

export default function AttendanceForm() {
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        photo: null as File | null,
        latitude: 0,
        longitude: 0,
        notes: '',
    });

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const showToast = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
        const id = Date.now().toString();
        const newToast: Toast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const getCurrentLocation = () => {
        setLocationLoading(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation tidak didukung oleh browser Anda.');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setData('latitude', latitude);
                setData('longitude', longitude);
                setLocationLoading(false);
            },
            (error) => {
                let errorMessage = 'Gagal mendapatkan lokasi. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Izin lokasi ditolak.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Informasi lokasi tidak tersedia.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Permintaan lokasi timeout.';
                        break;
                    default:
                        errorMessage += 'Terjadi kesalahan yang tidak diketahui.';
                        break;
                }
                setLocationError(errorMessage);
                setLocationLoading(false);
            }
        );
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): string[] => {
        const errors: string[] = [];

        // Validasi nama
        if (!data.name.trim()) {
            errors.push('Nama harus diisi');
        } else if (data.name.trim().length < 3) {
            errors.push('Nama minimal 3 karakter');
        }

        // Validasi foto
        if (!data.photo) {
            errors.push('Foto harus diupload');
        }

        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi lokasi
        if (!location) {
            setLocationError('Lokasi diperlukan untuk absensi. Mohon izinkan akses lokasi.');
            return;
        }

        // Validasi form fields
        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => {
                showToast(error, 'error');
            });
            return;
        }

        post(store().url, {
            onSuccess: () => {
                showToast('Absensi berhasil disimpan!', 'success');
                reset();
                setPhotoPreview(null);
                setLocation(null);
                getCurrentLocation();
            },
            onError: (errors) => {
                showToast('Terjadi kesalahan saat menyimpan data', 'error');
            },
        });
    };

    const formatCoordinates = (lat: number, lng: number) => {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    const getGoogleMapsUrl = (lat: number, lng: number) => {
        return `https://www.google.com/maps?q=${lat},${lng}&z=18`;
    };

    return (
        <>
            <Head title="Form Absensi" />

            <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative">
                {/* Header */}
                <div className="relative bg-white/10 backdrop-blur-lg border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-2 rounded-lg shadow-md">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-white">Absensi Kehadiran</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative max-w-md mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-6">
                            <div className="text-center">
                                {/* <h2 className="text-2xl font-semibold text-white">Form Attendance</h2> */}
                            </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                                    placeholder="Masukan Nama Anda"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4">
                                    {photoPreview ? (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 text-green-600 hover:text-green-700 text-sm font-medium"
                                            >
                                                Ganti Foto
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Klik untuk upload foto</p>
                                            <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG (max. 5MB)</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                {errors.photo && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Format foto tidak sesuai
                                    </p>
                                )}
                            </div>
                            
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lokasi
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4">
                                    {locationLoading ? (
                                        <div className="flex items-center justify-center space-x-2 py-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                                            <span className="text-sm text-gray-600">Mendapatkan Lokasi...</span>
                                        </div>
                                    ) : locationError ? (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <p className="text-sm text-red-700 mb-2">{locationError}</p>
                                            <button
                                                type="button"
                                                onClick={getCurrentLocation}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Coba Lagi
                                            </button>
                                        </div>
                                    ) : location ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm text-green-700 mb-2">Lokasi berhasil didapatkan!</p>
                                                    <p className="text-xs text-gray-600 font-mono">
                                                        <a
                                                            href={getGoogleMapsUrl(location.lat, location.lng)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                                                            title="Lihat di Google Maps"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            <span>Lihat Lokasi</span>
                                                        </a>
                                                    </p>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                {errors.latitude && (
                                    <p className="mt-1 text-sm text-red-500">{errors.latitude[0]}</p>
                                )}
                                {errors.longitude && (
                                    <p className="mt-1 text-sm text-red-500">{errors.longitude[0]}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan (Opsional)
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                                        placeholder="Tambah catatan jika dibutuhkan..."
                                        maxLength={1000}
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                                        {data.notes.length}/1000
                                    </div>
                                </div>
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-500">{errors.notes[0]}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || locationLoading || !location}
                                    className="w-full bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparen"></div>
                                            <span>Menyimpan...</span>
                                        </span>
                                    ) : (
                                        <span className='text-white'>Simpan</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Toast Container */}
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {toasts.map((toast, index) => (
                        <div
                            key={index}
                            className={`relative flex items-start p-4 rounded-lg shadow-lg backdrop-blur-lg transform transition-all duration-300 animate-in slide-in-from-right ${
                                toast.type === 'error'
                                    ? 'bg-red-500/90 text-white border border-red-400'
                                    : toast.type === 'success'
                                    ? 'bg-green-500/90 text-white border border-green-400'
                                    : 'bg-yellow-500/90 text-white border border-yellow-400'
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{toast.message}</p>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}