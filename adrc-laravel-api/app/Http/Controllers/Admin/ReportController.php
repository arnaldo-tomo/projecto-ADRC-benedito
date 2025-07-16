<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with('user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($userQuery) use ($request) {
                      $userQuery->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(15);

        return view('admin.reports.index', compact('reports'));
    }

    public function show(Report $report)
    {
        $report->load('user');
        return view('admin.reports.show', compact('report'));
    }

    public function updateStatus(Request $request, Report $report)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'in:pendente,em_andamento,resolvido'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $updateData = [
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ];

        if ($request->status === 'resolvido') {
            $updateData['resolved_at'] = now();
        }

        $report->update($updateData);

        return redirect()
            ->route('admin.reports.show', $report)
            ->with('success', 'Status da ocorrência atualizado com sucesso!');
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return redirect()
            ->route('admin.reports.index')
            ->with('success', 'Ocorrência excluída com sucesso!');
    }
}
