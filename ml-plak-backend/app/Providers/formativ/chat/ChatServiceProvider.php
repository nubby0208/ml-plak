<?php

namespace App\Providers\formativ\chat;

use Evenement\EventEmitter;
use Illuminate\Support\ServiceProvider;
use Ratchet\Server\IoServer;

use Evenement\EventEmitterInterface;

class ChatServiceProvider
extends ServiceProvider
{
    protected $defer = true;
    public function register()
    {
        $this->app->bind("chat.emitter", function()
        {
            return new EventEmitter();
        });
        $this->app->bind("chat.chat", function()
        {
            return new Chat(
                $this->app->make("chat.emitter")
            );
        });
        $this->app->bind("chat.user", function()
        {
            return new User();
        });
        $this->app->bind("chat.command.serve", function()
        {
            return new Command\Serve(
                //$this->app->make("chat.chat")
                new Chat(new EventEmitter())
            );
        });   
        $this->commands("chat.command.serve");
    }
    public function provides()
    {
        return [
            "chat.chat",
            "chat.command.serve",
            "chat.emitter",
            "chat.server"
        ];
    }
}
