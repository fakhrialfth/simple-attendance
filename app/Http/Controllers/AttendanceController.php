<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    public function index()
    {
        return inertia('Attendance/Form');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $photoPath = $request->file('photo')->store('attendance-photos', 'public');

        $googleMapsLink = "https://www.google.com/maps?q={$request->latitude},{$request->longitude}";

        Attendance::create([
            'name' => $request->name,
            'photo_path' => $photoPath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'google_maps_link' => $googleMapsLink,
            'notes' => $request->notes,
            'checked_in_at' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('attendance.success')
            ->with('success', 'Absensi berhasil dicatat!');
    }

    public function success()
    {
        return inertia('Attendance/Success');
    }

    public function dashboard()
    {
        $attendances = Attendance::latest()->paginate(50);

        return inertia('Admin/Dashboard', [
            'attendances' => $attendances,
        ]);
    }

    public function filter(Request $request)
    {
        $query = Attendance::query();

        if ($request->filled('date_from')) {
            $query->whereDate('checked_in_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('checked_in_at', '<=', $request->date_to);
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        $attendances = $query->latest()->paginate(50);

        return inertia('Admin/Dashboard', [
            'attendances' => $attendances,
            'filters' => $request->only(['date_from', 'date_to', 'name']),
        ]);
    }
}
