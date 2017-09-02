# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :kanban_server,
  namespace: Kanban,
  ecto_repos: [Kanban.Repo]

# Configures the endpoint
config :kanban_server, KanbanWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "1ZyNCAGRN8jSZszYpdCX9F3NqELJOtcbv6bCnhLwnxEkl5xo9XEKMNbF/63aYvvx",
  render_errors: [view: KanbanWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Kanban.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
