<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use App\Models\Notification;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pendente')->count(),
            'in_progress_reports' => Report::where('status', 'em_andamento')->count(),
            'resolved_reports' => Report::where('status', 'resolvido')->count(),
            'total_users' => User::where('role', 'user')->count(),
            'active_users' => User::where('role', 'user')->where('status', 'active')->count(),
            'today_reports' => Report::whereDate('created_at', today())->count(),
            'this_week_reports' => Report::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        $recent_reports = Report::with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $reports_by_type = Report::selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->get();

        $reports_by_status = Report::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $monthly_reports = Report::selectRaw('MONTH(created_at) as month, count(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->get();

        return view('admin.dashboard', compact(
            'stats',
            'recent_reports',
            'reports_by_type',
            'reports_by_status',
            'monthly_reports'
        ));
    }
}
