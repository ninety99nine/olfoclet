<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class UssdSessionEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $ussdMessage;
    public $ussdSubject;
    public $ussdSenderName;
    public $ussdSenderEmail;

    /**
     * Create a new message instance.
     */
    public function __construct($ussdSenderName, $ussdSenderEmail, $ussdSubject, $ussdMessage)
    {
        $this->ussdMessage = $ussdMessage;
        $this->ussdSubject = $ussdSubject;
        $this->ussdSenderName = $ussdSenderName;
        $this->ussdSenderEmail = $ussdSenderEmail;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->ussdSenderEmail, $this->ussdSenderName),
            subject: $this->ussdSubject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ussd.default',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
