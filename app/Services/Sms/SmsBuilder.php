<?php

namespace App\Services\Sms;

use smpp\SMPP;
use smpp\Address;
use smpp\transport\Socket;
use smpp\Client as SmppClient;

class SmsBuilder
{
    protected $transport;
    protected $smppClient;
    protected $debug = false;
    protected $from;
    protected $to;
    protected $login;
    protected $password;

    /**
     * SmsBuilder constructor.
     * @param string $address SMSC IP
     * @param int $port SMSC port
     * @param string $login
     * @param string $password
     * @param int $timeout timeout of reading PDU in milliseconds
     * @param bool $debug - debug flag when true output additional info
     */
    public function __construct(
        string $sender,
        string $address,
        int $port,
        string $login,
        string $password,
        int $timeout = 10000,
        bool $debug = false
    )
    {
        $this->transport = new Socket([$address], $port);
        $this->transport->setRecvTimeout($timeout);
        $this->smppClient = new SmppClient($this->transport);

        // Activate binary hex-output of server interaction
        $this->smppClient->debug = $debug;
        $this->transport->debug = $debug;

        $this->login = $login;
        $this->password = $password;

        $this->from = new Address($sender, SMPP::TON_ALPHANUMERIC);
    }

    /**
     * @param $sender
     * @param $ton
     * @return $this
     * @throws \Exception
     */
    public function setSender($sender, $ton)
    {
        return $this->setAddress($sender, 'from', $ton);
    }

    /**
     * @param $address
     * @param $ton
     * @return $this
     * @throws \Exception
     */
    public function setRecipient($address, $ton)
    {
        return $this->setAddress($address, 'to', $ton);
    }

    /**
     * @param $address
     * @param string $type
     * @param int $ton
     * @param int $npi
     * @return $this
     * @throws \Exception
     */
    protected function setAddress($address, string $type, $ton = SMPP::TON_UNKNOWN, $npi = SMPP::NPI_UNKNOWN)
    {
        // some example of data preparation
        if($ton === SMPP::TON_INTERNATIONAL){
             $npi = SMPP::NPI_E164;
        }
        $this->$type = new Address($address, $ton, $npi);
        return $this;
    }

    /**
     * @param string $message
     */
    public function sendMessage(string $message)
    {
        $this->transport->open();
        $this->smppClient->bindTransceiver($this->login,$this->password);
        // strongly recommend use SMPP::DATA_CODING_UCS2 as default encoding in project to prevent problems with non latin symbols
        $this->smppClient->sendSMS($this->from, $this->to, $message, null, SMPP::DATA_CODING_UCS2);
        $this->smppClient->close();
    }
}
