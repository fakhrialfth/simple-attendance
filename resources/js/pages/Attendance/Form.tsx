'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, MapPin, Upload, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

export default function AttendanceForm() {
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!location) {
            setLocationError('Lokasi diperlukan untuk absensi. Mohon izinkan akses lokasi.');
            return;
        }

        post(route('attendance.store'), {
            onSuccess: () => {
                reset();
                setPhotoPreview(null);
                setLocation(null);
                getCurrentLocation();
            },
        });
    };

    const formatCoordinates = (lat: number, lng: number) => {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    return (
        <>
            <Head title="Form Absensi" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Sistem Absensi Digital</h1>
                            </div>
                            <Link
                                href="/admin/login"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                            <div className="flex items-center space-x-3">
                                <User className="w-8 h-8 text-white" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Form Absensi</h2>
                                    <p className="text-blue-100 text-sm mt-1">Isi form di bawah untuk melakukan absensi</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Masukkan nama lengkap Anda"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Camera className="inline w-4 h-4 mr-1" />
                                    Foto Selfie
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative group cursor-pointer"
                                    >
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:bg-gray-50 transition-all">
                                                <Camera className="w-8 h-8 text-gray-400 group-hover:text-gray-500" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Pilih Foto
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">Format: JPEG, PNG, JPG, GIF (Max: 5MB)</p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    required
                                />
                                {errors.photo && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.photo[0]}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Lokasi GPS
                                </label>
                                {locationLoading ? (
                                    <div className="flex items-center space-x-2 text-blue-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="text-sm">Mendapatkan lokasi...</span>
                                    </div>
                                ) : locationError ? (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {locationError}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="mt-2 text-sm text-red-600 underline hover:text-red-700"
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                ) : location ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-700 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Lokasi berhasil didapatkan: {formatCoordinates(location.lat, location.lng)}
                                        </p>
                                        <a
                                            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-700 underline mt-1 inline-block"
                                        >
                                            Lihat di Google Maps
                                        </a>
                                    </div>
                                ) : null}
                                {errors.latitude && (
                                    <p className="mt-1 text-sm text-red-600">{errors.latitude[0]}</p>
                                )}
                                {errors.longitude && (
                                    <p className="mt-1 text-sm text-red-600">{errors.longitude[0]}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    maxLength={1000}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {data.notes.length}/1000 karakter
                                </p>
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes[0]}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || locationLoading || !location}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Menyimpan...</span>
                                        </div>
                                    ) : (
                                        <span>Absen Sekarang</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-blue-800">Penting:</h3>
                                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                    <li>• Pastikan Anda mengizinkan akses lokasi pada browser</li>
                                    <li>• Foto selfie harus jelas dan terlihat wajah</li>
                                    <li>• Pastikan koneksi internet stabil</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}