<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class EmergencyReport extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id', 'barangay_id', 'category_id', 'contact_name', 'contact_phone', 'address', 'latitude', 'longitude', 'description', 'priority', 'status'];
    public function user() { return $this->belongsTo(User::class); }
    public function barangay() { return $this->belongsTo(Barangay::class); }
    public function category() { return $this->belongsTo(EmergencyCategory::class); }
    public function assignments() { return $this->hasMany(EmergencyAssignment::class); }
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}