<?php

namespace App\Providers\formativ\chat;

use Evenement\EventEmitterInterface;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
interface UserInterface
{
    public function getSocket();
    public function setSocket(ConnectionInterface $socket);
    public function getId();
    public function setId($id);
    public function getName();
    public function setName($name);
}