<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class EmergencyAssignment extends Model {
    protected $fillable = ['emergency_report_id', 'responder_id', 'assigned_by', 'acknowledged_at', 'arrived_at'];
    protected $casts = ['acknowledged_at' => 'datetime', 'arrived_at' => 'datetime'];
    public function emergencyReport() { return $this->belongsTo(EmergencyReport::class); }
    public function responder() { return $this->belongsTo(User::class, 'responder_id'); }
    public function assigner() { return $this->belongsTo(User::class, 'assigned_by'); }
}