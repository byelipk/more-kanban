defmodule KanbanWeb.V1.BoardController do
  use KanbanWeb, :controller

  import Ecto.Query

  alias Kanban.{ Repo, Board }

  def index(conn, _params) do
    render conn, "index.json", boards: Repo.all(Board)
  end

  def show(conn, %{"id" => id}) do
    render conn, "show.json", board: Repo.get(Board, id)
  end

end
