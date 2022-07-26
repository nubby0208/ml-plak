<?php

namespace App\Providers\formativ\chat\Command;
//namespace Illuminate\Foundation\Console;

use Illuminate\Console\Command;
//use Illuminate\Console\Command;

use App\Providers\formativ\chat\ChatInterface;
use  App\Providers\formativ\chat\Chat;
use  App\Providers\formativ\chat\User;
use App\Providers\formativ\chat\UserInterface;

use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class Serve extends Command
{
    protected $name        = "chat:serve";
    protected $description = "Command description.";
    protected $chat;
    protected function getUserName($user)
    {
        $suffix = " (" . $user->getId() . ")";
        if ($name = $user->getName())
        {
            return $name . $suffix;
        }
        return "User" . $suffix;
    }
    public function __construct(Chat $chat)
    {
        parent::__construct();
        $this->chat = $chat;
        $open = function(User $user)
        {
            $name = $this->getUserName($user);
            $this->line("
                <info>" . $name . " connected.</info>
            ");
        };
        $this->chat->getEmitter()->on("open", $open);
        $close = function(User $user)
        {
            $name = $this->getUserName($user);
            $this->line("
                <info>" . $name . " disconnected.</info>
            ");
        };
        $this->chat->getEmitter()->on("close", $close);
        $message = function(User $user, $message)
        {
            $name = $this->getUserName($user);
            $this->line("
                <info>New message from " . $name . ":</info> 
                <comment>" . $message . "</comment>
                <info>.</info>
            ");
        };
        $this->chat->getEmitter()->on("message", $message);
        $name = function(User $user, $message)
        {
            $this->line("
                <info>User changed their name to:</info> 
                <comment>" . $message . "</comment>
                <info>.</info>
            ");
        };
        $this->chat->getEmitter()->on("name", $name);
        $error = function(User $user, $exception)
        {
            $message = $exception->getMessage();
            $this->line("
                <info>User encountered an exception:</info> 
                <comment>" . $message . "</comment>
                <info>.</info>
            ");
        };
        $this->chat->getEmitter()->on("error", $error);
    }
    public function fire()
    {
        $port = (integer) $this->option("port");
        if (!$port)
        {
            $port = 7778;
        }
        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    $this->chat
                )
            ),
            $port
        );
        $this->line("
            <info>Listening on port</info>
            <comment>" . $port . "</comment>
            <info>.</info>
        ");
        $server->run();
    }
    protected function getOptions()
    {
        return [
            [
                "port",
                null,
                InputOption::VALUE_REQUIRED,
                "Port to listen on.",
                null
            ]
        ];
    }
}