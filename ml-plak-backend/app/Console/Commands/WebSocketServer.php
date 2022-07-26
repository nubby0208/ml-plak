<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Evenement\EventEmitter;
use App\Providers\formativ\chat\Chat;
use App\Providers\formativ\chat\User;
use Illuminate\Support\Facades\Log;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'websocket:init';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Initialization of web socket';

	protected $chat;

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$chat = new Chat(new EventEmitter());
		parent::__construct();

		$this->chat = $chat;

		$this->chat->getEmitter()->on("open", function ($user) { 
			$this->onOpen($user);
		});

		$this->chat->getEmitter()->on("close", function ($user) {
			$this->onClose($user);
		});

		$this->chat->getEmitter()->on("message", function ($user, $message) {
			$this->onMessage($user, $message);
		});

		$this->chat->getEmitter()->on("name", function($user, $message) {
			$this->onName($user, $message);
		});

		$this->chat->getEmitter()->on("error", function($socket, $exception) {
			$this->onError($socket, $exception);
		});
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function handle()
	{
		$port = env('WS_PORT', 7778); // (integer) $this->option("port");

		if (!$port)
			$port = 7778;

		$app = new HttpServer(new WsServer($this->chat));
		$loop = \React\EventLoop\Factory::create();
		$hostname = "0.0.0.0:".$port;
		$secure_websockets = new \React\Socket\Server($hostname, $loop);
		$secure_websockets = new \React\Socket\SecureServer($secure_websockets, $loop, [
			'local_cert' => config('app.ssl_cert'),
			'local_pk' => config('app.ssl_private'),
			'verify_peer' => false
		]);

		$server = new IoServer($app, $secure_websockets, $loop);

		Log::info("Listening on port: ".$port);
		$this->line("Listening on port: ".$port);

		$server->run();
	}

	protected function getUserName($user)
	{
		$suffix = " (" . $user->getId() . ")";

		if ($name = $user->getName()) {
			return $name . $suffix;
		}

		return "User" . $suffix;
	}

	private function onOpen($user)
	{
		$name = $this->getUserName($user);

		Log::info("User: ".$name." connected");
		$this->line("<info>" . $name . " connected.</info>");
	}

	private function onClose($user)
	{
		$name = $this->getUserName($user);
		Log::info("User: ".$name." disconnected");
		$this->line("<info>" . $name . " disconnected.</info>");
	}

	private function onMessage($user, $message)
	{
		$name = $this->getUserName($user);
		$this->line("
			<info>New message from " . $name . ":</info> 
			<comment>" . $message . "</comment>
			<info>.</info>
		");
	}

	private function onName($user, $message)
	{
		$this->line("
			<info>User changed their name to:</info> 
			<comment>" . $message . "</comment>
			<info>.</info>
		");
	}

	private function onError($socket, $exception)
	{
		$message = $exception->getMessage();
		$this->line("User encountered an exception:" . $message);
	}
}
