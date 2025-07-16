<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'description',
        'location',
        'latitude',
        'longitude',
        'status',
        'priority',
        'photos',
        'resolved_at',
        'admin_notes',
    ];

    protected $casts = [
        'photos' => 'array',
        'resolved_at' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTypeTextAttribute()
    {
        return match($this->type) {
            'vazamento' => 'Vazamento',
            'falta_agua' => 'Falta de Água',
            'pressao_baixa' => 'Pressão Baixa',
            'qualidade_agua' => 'Qualidade da Água',
            default => 'Outros'
        };
    }

    public function getStatusTextAttribute()
    {
        return match($this->status) {
            'pendente' => 'Pendente',
            'em_andamento' => 'Em Andamento',
            'resolvido' => 'Resolvido',
            default => 'Desconhecido'
        };
    }

    public function getPriorityTextAttribute()
    {
        return match($this->priority) {
            'baixa' => 'Baixa',
            'media' => 'Média',
            'alta' => 'Alta',
            default => 'Média'
        };
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
