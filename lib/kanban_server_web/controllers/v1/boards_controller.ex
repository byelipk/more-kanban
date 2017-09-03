defmodule KanbanWeb.V1.BoardsController do
  use KanbanWeb, :controller

  def index(conn, _params) do
    render conn, "index.json"
  end

end
