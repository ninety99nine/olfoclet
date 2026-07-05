<?php

namespace App\Models;

/**
 * READ-ONLY history model over the `ussd_sessions_all` UNION view (24h live +
 * up to 3 months archived). Used by the Sessions list, session-detail view, and
 * reports so they show the full retention window, while the USSD runtime and ALL
 * writes keep using the base {@see UssdSession} model (the small, hot table).
 *
 * Extends UssdSession only to inherit its casts, relationships and query scopes;
 * the sole difference is the read source. The underlying view is NOT updatable,
 * so writes are blocked outright to fail loudly instead of corrupting silently.
 */
class SessionHistory extends UssdSession
{
    protected $table = 'ussd_sessions_all';

    /** Hard guard: this model is read-only. Persist via UssdSession, never here. */
    public function save(array $options = [])
    {
        throw new \LogicException('SessionHistory is a read-only UNION view; write through UssdSession instead.');
    }

    public function delete()
    {
        throw new \LogicException('SessionHistory is a read-only UNION view; delete through UssdSession instead.');
    }
}
