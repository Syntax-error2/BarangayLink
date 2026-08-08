<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ReportStatusHistory extends Model {
    protected $fillable = ['report_id', 'user_id', 'status', 'remarks'];
    public function report() { return $this->belongsTo(Report::class); }
    public function user() { return $this->belongsTo(User::class); }
}