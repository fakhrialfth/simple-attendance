'use client'

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    Users,
    Calendar,
    Filter,
    Search,
    MapPin,
    Clock,
    Eye,
    LogOut,
    BarChart3,
    TrendingUp
} from 'lucide-react';

interface Attendance {
    id: number;
    name: string;
    photo_path: string;
    latitude: number | string | null;
    longitude: number | string | null;
    google_maps_link: string;
    notes?: string;
    checked_in_at: string;
    ip_address?: string;
    user_agent?: string;
}

interface PaginatedData {
    data: Attendance[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DashboardProps {
    attendances: PaginatedData;
    filters?: {
        date_from?: string;
        date_to?: string;
        name?: string;
    };
}

export default function AdminDashboard({ attendances, filters = {} }: DashboardProps) {
    const [searchName, setSearchName] = useState(filters.name || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (searchName) params.append('name', searchName);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);

        router.get(
            route('admin.attendance.filter') + (params.toString() ? '?' + params.toString() : ''),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleResetFilters = () => {
        setSearchName('');
        setDateFrom('');
        setDateTo('');

        router.get(
            route('admin.dashboard'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCoordinates = (lat: number | string | null | undefined, lng: number | string | null | undefined) => {
        const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
        const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;

        if (latNum === null || latNum === undefined || lngNum === null || lngNum === undefined ||
            isNaN(latNum) || isNaN(lngNum)) {
            return 'Koordinat tidak tersedia';
        }

        return `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
    };

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo and Title */}
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg flex-shrink-0">
                                    <BarChart3 className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-lg font-bold text-gray-900 sm:text-xl truncate">Dashboard Admin</h1>
                                    <p className="text-xs text-gray-500 sm:text-sm hidden sm:block">Sistem Absensi Digital</p>
                                </div>
                            </div>

                            {/* Navigation Actions */}
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Link
                                    href="/absen"
                                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50 sm:text-sm sm:px-3 sm:py-2"
                                >
                                    <span className="hidden sm:inline">Lihat Form Absensi</span>
                                    <span className="sm:hidden">Form</span>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 sm:text-sm sm:space-x-2 sm:px-3 sm:py-2"
                                >
                                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Absensi</p>
                                    <p className="text-2xl font-bold text-gray-900">{attendances.total}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Hari Ini</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {attendances.data.filter(a =>
                                            new Date(a.checked_in_at).toDateString() === new Date().toDateString()
                                        ).length}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Minggu Ini</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {attendances.data.filter(a => {
                                            const attendanceDate = new Date(a.checked_in_at);
                                            const today = new Date();
                                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            return attendanceDate >= weekAgo;
                                        }).length}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Halaman</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {attendances.current_page}/{attendances.last_page}
                                    </p>
                                </div>
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <Filter className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filter Data
                                </h2>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
                                </button>
                            </div>

                            {showFilters && (
                                <form onSubmit={handleFilter} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Search className="inline w-4 h-4 mr-1" />
                                                Nama
                                            </label>
                                            <input
                                                type="text"
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Cari nama..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dari Tanggal
                                            </label>
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sampai Tanggal
                                            </label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Terapkan Filter
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResetFilters}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Data Absensi</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Foto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lokasi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Catatan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendances.data.length > 0 ? (
                                        attendances.data.map((attendance) => (
                                            <tr key={attendance.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {attendance.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                                            src={attendance.photo_path ? `/storage/${attendance.photo_path}` : '/placeholder-avatar.png'}
                                                            alt={`${attendance.name}'s photo`}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(attendance.checked_in_at)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(attendance.checked_in_at).toLocaleTimeString('id-ID')}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="flex items-center mb-1">
                                                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                            <span className="text-xs">
                                                                {formatCoordinates(attendance.latitude, attendance.longitude)}
                                                            </span>
                                                        </div>
                                                        {attendance.google_maps_link && (
                                                            <a
                                                                href={attendance.google_maps_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                                                            >
                                                                Lihat di Maps
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {attendance.notes || '-'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {attendance.photo_path && (
                                                        <button
                                                            onClick={() => window.open(`/storage/${attendance.photo_path}`, '_blank')}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                            title="Lihat Foto"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Users className="w-12 h-12 text-gray-400 mb-3" />
                                                    <p className="text-gray-500">Tidak ada data absensi</p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {searchName || dateFrom || dateTo ? 'Coba ubah filter' : 'Belum ada yang melakukan absensi'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {attendances.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan {((attendances.current_page - 1) * attendances.per_page) + 1} hingga{' '}
                                        {Math.min(attendances.current_page * attendances.per_page, attendances.total)} dari{' '}
                                        {attendances.total} hasil
                                    </div>
                                    <div className="flex space-x-2">
                                        {attendances.current_page > 1 && (
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams();
                                                    if (searchName) params.append('name', searchName);
                                                    if (dateFrom) params.append('date_from', dateFrom);
                                                    if (dateTo) params.append('date_to', dateTo);
                                                    params.append('page', (attendances.current_page - 1).toString());

                                                    router.get(
                                                        route('admin.attendance.filter') + '?' + params.toString(),
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        }
                                                    );
                                                }}
                                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {attendances.current_page < attendances.last_page && (
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams();
                                                    if (searchName) params.append('name', searchName);
                                                    if (dateFrom) params.append('date_from', dateFrom);
                                                    if (dateTo) params.append('date_to', dateTo);
                                                    params.append('page', (attendances.current_page + 1).toString());

                                                    router.get(
                                                        route('admin.attendance.filter') + '?' + params.toString(),
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        }
                                                    );
                                                }}
                                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}