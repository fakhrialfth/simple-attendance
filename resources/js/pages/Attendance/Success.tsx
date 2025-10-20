'use client'

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, Home, ArrowLeft } from 'lucide-react';

export default function AttendanceSuccess() {
    return (
        <>
            <Head title="Absensi Berhasil" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    {/* Success Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
                            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Absensi Berhasil!</h1>
                            <p className="text-green-100">Data absensi Anda telah berhasil disimpan</p>
                        </div>

                        {/* Success Body */}
                        <div className="p-8 text-center">
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-center space-x-2 text-gray-600">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-sm">
                                        {new Date().toLocaleString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                                <p className="text-sm text-green-700">
                                    Terima kasih telah melakukan absensi. Data Anda telah tersimpan dengan aman dalam sistem.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/absen"
                                    className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Absen Lagi</span>
                                </Link>

                                <Link
                                    href="/"
                                    className="w-full inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Kembali ke Beranda</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Jika ada pertanyaan, hubungi administrator sistem.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}