<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo_path',
        'latitude',
        'longitude',
        'google_maps_link',
        'notes',
        'checked_in_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'checked_in_at' => 'datetime',
    ];

    public function getPhotoUrlAttribute()
    {
        return asset('storage/' . $this->photo_path);
    }
}
