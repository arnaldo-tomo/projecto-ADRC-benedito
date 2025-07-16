<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'auto_notifications' => SystemSetting::get('auto_notifications', true),
            'email_alerts' => SystemSetting::get('email_alerts', true),
            'sms_alerts' => SystemSetting::get('sms_alerts', false),
            'maintenance_mode' => SystemSetting::get('maintenance_mode', false),
            'data_backup' => SystemSetting::get('data_backup', true),
            'user_registration' => SystemSetting::get('user_registration', true),
            'geo_location' => SystemSetting::get('geo_location', true),
            'analytics' => SystemSetting::get('analytics', true),
        ];

        return view('admin.settings.index', compact('settings'));
    }

    public function update(Request $request)
    {
        $settings = [
            'auto_notifications' => $request->boolean('auto_notifications'),
            'email_alerts' => $request->boolean('email_alerts'),
            'sms_alerts' => $request->boolean('sms_alerts'),
            'maintenance_mode' => $request->boolean('maintenance_mode'),
            'data_backup' => $request->boolean('data_backup'),
            'user_registration' => $request->boolean('user_registration'),
            'geo_location' => $request->boolean('geo_location'),
            'analytics' => $request->boolean('analytics'),
        ];

        foreach ($settings as $key => $value) {
            SystemSetting::set($key, $value, 'boolean');
        }

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Configurações atualizadas com sucesso!');
    }
}
