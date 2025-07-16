<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Report;
use App\Models\Notification;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Administrador AdRC',
            'email' => 'admin@adrc.mz',
            'password' => Hash::make('admin123'),
            'phone' => '+258 23 323 456',
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Create test users
        User::factory(50)->create();

        // Create test reports
        Report::factory(100)->create();

        // Create test notifications
        Notification::factory(20)->create();

        // Create system settings
        $settings = [
            ['key' => 'auto_notifications', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'email_alerts', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'sms_alerts', 'value' => '0', 'type' => 'boolean'],
            ['key' => 'maintenance_mode', 'value' => '0', 'type' => 'boolean'],
            ['key' => 'data_backup', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'user_registration', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'geo_location', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'analytics', 'value' => '1', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            SystemSetting::create($setting);
        }
    }
}
