<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ResidentProfile extends Model {
    protected $fillable = ['user_id', 'address', 'emergency_contact_name', 'emergency_contact_phone'];
    public function user() { return $this->belongsTo(User::class); }
}