<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ResponderProfile extends Model {
    protected $fillable = ['user_id', 'unit', 'specialty', 'is_available'];
    protected $casts = ['is_available' => 'boolean'];
    public function user() { return $this->belongsTo(User::class); }
}