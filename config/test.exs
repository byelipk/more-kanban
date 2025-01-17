use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :kanban_server, KanbanWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :kanban_server, Kanban.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "kanban_server_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

import_config "local.secret.exs"
