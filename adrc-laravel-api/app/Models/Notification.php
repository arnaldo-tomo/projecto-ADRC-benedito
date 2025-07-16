<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'target_audience',
        'location',
        'is_scheduled',
        'scheduled_at',
        'recipients_count',
        'sent_at',
    ];

    protected $casts = [
        'is_scheduled' => 'boolean',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_notifications')
                    ->withPivot('is_read', 'read_at')
                    ->withTimestamps();
    }

    public function getTypeTextAttribute()
    {
        return match($this->type) {
            'info' => 'Informação',
            'warning' => 'Aviso',
            'emergency' => 'Emergência',
            'success' => 'Sucesso',
            default => 'Informação'
        };
    }

    public function getTargetAudienceTextAttribute()
    {
        return match($this->target_audience) {
            'all' => 'Todos os Usuários',
            'location' => 'Por Localização',
            'active' => 'Usuários Ativos',
            default => 'Todos'
        };
    }

    public function scopeSent($query)
    {
        return $query->whereNotNull('sent_at');
    }

    public function scopePending($query)
    {
        return $query->whereNull('sent_at');
    }

    public function scopeScheduled($query)
    {
        return $query->where('is_scheduled', true);
    }
}
