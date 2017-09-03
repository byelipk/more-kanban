defmodule KanbanWeb.HomeController do
  use KanbanWeb, :controller

  def index(conn, _params) do
    conn
    |> put_layout("kanban.html")
    |> render("index.html")
  end
end
