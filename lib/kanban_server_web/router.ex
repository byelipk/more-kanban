defmodule KanbanWeb.Router do
  use KanbanWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", KanbanWeb do
    pipe_through :browser # Use the default browser stack

    get "/", HomeController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", KanbanWeb do
    pipe_through :api

    scope "/v1", V1, as: :v1 do
      resources "/boards", BoardsController, only: [:index]
    end
  end
end
