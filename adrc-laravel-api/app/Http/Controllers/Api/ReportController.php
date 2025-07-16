<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = Report::with('user')
            ->where('user_id', $request->user()->id)
            ->when($request->status, function($query) use ($request) {
                return $query->where('status', $request->status);
            })
            ->when($request->type, function($query) use ($request) {
                return $query->where('type', $request->type);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => ['required', 'in:vazamento,falta_agua,pressao_baixa,qualidade_agua'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'location' => ['required', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['string'], // Base64 encoded images
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $report = Report::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'photos' => $request->photos,
            'priority' => $this->determinePriority($request->type, $request->description),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report created successfully',
            'data' => $report->load('user')
        ], 201);
    }

    public function show(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $report->load('user')
        ]);
    }

    public function update(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($report->status !== 'pendente') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update report that is already being processed'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:1000'],
            'location' => ['sometimes', 'string', 'max:500'],
            'latitude' => ['sometimes', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'numeric', 'between:-180,180'],
            'photos' => ['sometimes', 'array'],
            'photos.*' => ['string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $report->update($request->only([
            'title', 'description', 'location', 'latitude', 'longitude', 'photos'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Report updated successfully',
            'data' => $report->load('user')
        ]);
    }

    public function destroy(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($report->status !== 'pendente') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete report that is already being processed'
            ], 422);
        }

        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Report deleted successfully'
        ]);
    }

    private function determinePriority($type, $description)
    {
        $urgentKeywords = ['emergência', 'urgente', 'crítico', 'grave'];
        $description = strtolower($description);

        foreach ($urgentKeywords as $keyword) {
            if (strpos($description, $keyword) !== false) {
                return 'alta';
            }
        }

        if ($type === 'vazamento') {
            return 'alta';
        }

        if ($type === 'falta_agua') {
            return 'media';
        }

        return 'baixa';
    }
}
