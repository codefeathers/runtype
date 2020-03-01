if (!process.env.npm_config_user_agent.startsWith("pnpm/")) {
	console.log(
		"Use `npm i -g pnpm` and `pnpm install` to install dependencies in this repository.",
		"\nRemove this message in scripts if you're forking.",
	);
	process.exit(1);
}
