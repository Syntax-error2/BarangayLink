<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Facility extends Model {
    protected $fillable = ['barangay_id', 'name', 'type', 'address', 'latitude', 'longitude', 'contact_number', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function barangay() { return $this->belongsTo(Barangay::class); }
}