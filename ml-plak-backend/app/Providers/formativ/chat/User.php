<?php

namespace App\Providers\formativ\chat;

use Ratchet\ConnectionInterface;

class User implements UserInterface {
    protected $socket;
    protected $id;
    protected $name;
    protected $app_data;

    public function getSocket()
    {
        return $this->socket;
    }
    public function setSocket(ConnectionInterface $socket)
    {
        $this->socket = $socket;
        return $this;
    }
    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }
    public function getName()
    {
        return $this->name;
    }
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    public function setAppData($app_data)
    {
        if (empty($app_data) || count($app_data) === 0) {
            return false;
        }

        if (is_string($app_data)) {
            $app_data = json_decode($app_data, true);
        }

        $this->app_data = $app_data;

        return true;
    }

    public function getAppData()
    {
        // Retorna stdClass
        return $this->app_data;
    }

    public function getUserId()
    {
        return $this->app_data['id'];
    }

    public function getAppUsername()
    {
        return $this->app_data['usuario'];
    }
}