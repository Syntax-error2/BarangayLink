<?php
$migrationsDir = __DIR__ . '/database/migrations';
$files = glob($migrationsDir . '/*.php');
foreach ($files as $file) {
    if (basename($file) !== '0001_01_01_000001_create_cache_table.php' && basename($file) !== '0001_01_01_000002_create_jobs_table.php' && !str_contains($file, 'personal_access_tokens') && !str_contains($file, 'notifications')) {
        unlink($file);
    }
}

$tables = [
    '0000_01_01_000000_create_roles_table' => "
            \$table->id();
            \$table->string('name')->unique();
            \$table->string('slug')->unique();
            \$table->string('description')->nullable();
            \$table->timestamps();
    ",
    '0000_01_01_000001_create_barangays_table' => "
            \$table->id();
            \$table->string('name');
            \$table->string('city');
            \$table->string('province');
            \$table->string('region');
            \$table->string('logo_path')->nullable();
            \$table->timestamps();
            \$table->softDeletes();
    ",
    '0001_01_01_000000_create_users_table' => "
            \$table->id();
            \$table->string('first_name');
            \$table->string('last_name');
            \$table->string('email')->unique();
            \$table->timestamp('email_verified_at')->nullable();
            \$table->string('password');
            \$table->string('phone')->nullable();
            \$table->foreignId('role_id')->constrained('roles');
            \$table->foreignId('barangay_id')->nullable()->constrained('barangays');
            \$table->boolean('is_active')->default(true);
            \$table->string('profile_photo_path')->nullable();
            \$table->rememberToken();
            \$table->timestamps();
            \$table->softDeletes();
    ",
    '0001_01_01_000000_create_password_reset_tokens_table' => "
            \$table->string('email')->primary();
            \$table->string('token');
            \$table->timestamp('created_at')->nullable();
    ",
    '0001_01_01_000000_create_sessions_table' => "
            \$table->string('id')->primary();
            \$table->foreignId('user_id')->nullable()->index();
            \$table->string('ip_address', 45)->nullable();
            \$table->text('user_agent')->nullable();
            \$table->longText('payload');
            \$table->integer('last_activity')->index();
    ",
    '2026_08_08_000002_create_resident_profiles_table' => "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            \$table->string('address');
            \$table->string('emergency_contact_name')->nullable();
            \$table->string('emergency_contact_phone')->nullable();
            \$table->timestamps();
    ",
    '2026_08_08_000003_create_staff_profiles_table' => "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            \$table->string('position');
            \$table->string('department')->nullable();
            \$table->timestamps();
    ",
    '2026_08_08_000004_create_responder_profiles_table' => "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            \$table->string('unit');
            \$table->string('specialty')->nullable();
            \$table->boolean('is_available')->default(true);
            \$table->timestamps();
    ",
    '2026_08_08_000005_create_report_categories_table' => "
            \$table->id();
            \$table->string('name');
            \$table->string('description')->nullable();
            \$table->boolean('is_active')->default(true);
            \$table->timestamps();
    ",
    '2026_08_08_000006_create_reports_table' => "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users');
            \$table->foreignId('barangay_id')->constrained('barangays');
            \$table->foreignId('category_id')->constrained('report_categories');
            \$table->string('title');
            \$table->text('description');
            \$table->string('address');
            \$table->decimal('latitude', 10, 8)->nullable();
            \$table->decimal('longitude', 11, 8)->nullable();
            \$table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            \$table->enum('status', ['SUBMITTED', 'RECEIVED', 'VERIFIED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'])->default('SUBMITTED');
            \$table->timestamps();
            \$table->softDeletes();
    ",
    '2026_08_08_000007_create_report_status_histories_table' => "
            \$table->id();
            \$table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            \$table->foreignId('user_id')->nullable()->constrained('users')->comment('User who changed the status');
            \$table->string('status');
            \$table->text('remarks')->nullable();
            \$table->timestamps();
    ",
    '2026_08_08_000008_create_report_assignments_table' => "
            \$table->id();
            \$table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            \$table->foreignId('responder_id')->constrained('users');
            \$table->foreignId('assigned_by')->constrained('users');
            \$table->text('remarks')->nullable();
            \$table->timestamps();
    ",
    '2026_08_08_000009_create_service_types_table' => "
            \$table->id();
            \$table->string('name');
            \$table->text('description')->nullable();
            \$table->text('requirements')->nullable();
            \$table->string('processing_time')->nullable();
            \$table->boolean('is_active')->default(true);
            \$table->timestamps();
    ",
    '2026_08_08_000010_create_service_requests_table' => "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users');
            \$table->foreignId('barangay_id')->constrained('barangays');
            \$table->foreignId('service_type_id')->constrained('service_types');
            \$table->enum('status', ['SUBMITTED', 'UNDER REVIEW', 'PROCESSING', 'READY', 'COMPLETED', 'RELEASED', 'REJECTED'])->default('SUBMITTED');
            \$table->text('remarks')->nullable();
            \$table->timestamps();
            \$table->softDeletes();
    ",
    '2026_08_08_000011_create_service_request_histories_table' => "
            \$table->id();
            \$table->foreignId('service_request_id')->constrained('service_requests')->onDelete('cascade');
            \$table->foreignId('user_id')->nullable()->constrained('users');
            \$table->string('status');
            \$table->text('remarks')->nullable();
            \$table->timestamps();
    ",
    '2026_08_08_000012_create_emergency_categories_table' => "
            \$table->id();
            \$table->string('name');
            \$table->string('color_code')->nullable();
            \$table->boolean('is_active')->default(true);
            \$table->timestamps();
    ",
    '2026_08_08_000013_create_emergency_reports_table' => "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users');
            \$table->foreignId('barangay_id')->constrained('barangays');
            \$table->foreignId('category_id')->constrained('emergency_categories');
            \$table->string('contact_name');
            \$table->string('contact_phone');
            \$table->string('address');
            \$table->decimal('latitude', 10, 8);
            \$table->decimal('longitude', 11, 8);
            \$table->text('description')->nullable();
            \$table->enum('priority', ['High', 'Critical'])->default('Critical');
            \$table->enum('status', ['REPORTED', 'ACKNOWLEDGED', 'RESPONDER ASSIGNED', 'RESPONDING', 'ON SITE', 'RESOLVED', 'CLOSED', 'FALSE ALARM'])->default('REPORTED');
            \$table->timestamps();
            \$table->softDeletes();
    ",
    '2026_08_08_000014_create_emergency_assignments_table' => "
            \$table->id();
            \$table->foreignId('emergency_report_id')->constrained('emergency_reports')->onDelete('cascade');
            \$table->foreignId('responder_id')->constrained('users');
            \$table->foreignId('assigned_by')->nullable()->constrained('users');
            \$table->timestamp('acknowledged_at')->nullable();
            \$table->timestamp('arrived_at')->nullable();
            \$table->timestamps();
    ",
    '2026_08_08_000015_create_announcements_table' => "
            \$table->id();
            \$table->foreignId('barangay_id')->constrained('barangays');
            \$table->foreignId('author_id')->constrained('users');
            \$table->string('title');
            \$table->longText('content');
            \$table->string('category');
            \$table->string('featured_image_path')->nullable();
            \$table->timestamp('publish_date')->nullable();
            \$table->timestamp('expiration_date')->nullable();
            \$table->boolean('is_published')->default(false);
            \$table->timestamps();
            \$table->softDeletes();
    ",
    '2026_08_08_000016_create_facilities_table' => "
            \$table->id();
            \$table->foreignId('barangay_id')->constrained('barangays');
            \$table->string('name');
            \$table->string('type'); // Health center, Evacuation center, etc.
            \$table->string('address');
            \$table->decimal('latitude', 10, 8)->nullable();
            \$table->decimal('longitude', 11, 8)->nullable();
            \$table->string('contact_number')->nullable();
            \$table->boolean('is_active')->default(true);
            \$table->timestamps();
    ",
    '2026_08_08_000017_create_attachments_table' => "
            \$table->id();
            \$table->morphs('attachable');
            \$table->string('file_path');
            \$table->string('file_name');
            \$table->string('file_type');
            \$table->integer('file_size')->nullable();
            \$table->foreignId('uploaded_by')->constrained('users');
            \$table->timestamps();
    ",
    '2026_08_08_000018_create_audit_logs_table' => "
            \$table->id();
            \$table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            \$table->string('action');
            \$table->string('module');
            \$table->unsignedBigInteger('record_id')->nullable();
            \$table->text('description');
            \$table->string('ip_address')->nullable();
            \$table->timestamps();
    ",
];

foreach ($tables as $filename => $schema) {
    preg_match('/create_(.*)_table/', $filename, $matches);
    $tableName = $matches[1] ?? 'unknown';
    if ($filename === '0001_01_01_000000_create_password_reset_tokens_table') {
        $tableName = 'password_reset_tokens';
    } elseif ($filename === '0001_01_01_000000_create_sessions_table') {
        $tableName = 'sessions';
    }
    
    $content = <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('{$tableName}', function (Blueprint \$table) {
{$schema}
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('{$tableName}');
    }
};
PHP;
    file_put_contents($migrationsDir . '/' . $filename . '.php', $content);
}

echo "Migrations generated successfully.\n";
