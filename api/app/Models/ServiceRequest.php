<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ServiceRequest extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id', 'barangay_id', 'service_type_id', 'status', 'remarks'];
    public function user() { return $this->belongsTo(User::class); }
    public function barangay() { return $this->belongsTo(Barangay::class); }
    public function serviceType() { return $this->belongsTo(ServiceType::class); }
    public function histories() { return $this->hasMany(ServiceRequestHistory::class); }
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}