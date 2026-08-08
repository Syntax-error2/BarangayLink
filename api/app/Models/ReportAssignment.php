<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ReportAssignment extends Model {
    protected $fillable = ['report_id', 'responder_id', 'assigned_by', 'remarks'];
    public function report() { return $this->belongsTo(Report::class); }
    public function responder() { return $this->belongsTo(User::class, 'responder_id'); }
    public function assigner() { return $this->belongsTo(User::class, 'assigned_by'); }
}