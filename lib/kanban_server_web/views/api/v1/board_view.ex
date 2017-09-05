defmodule KanbanWeb.Api.V1.BoardView do
  use KanbanWeb, :view

  alias KanbanWeb.Api.V1.BoardView

  def render("index.json", %{boards: boards}) do
    %{data: render_many(boards, BoardView, "board.json")}
  end

  def render("show.json", %{board: board}) do
    %{data: render_one(board, BoardView, "board.json")}
  end

  def render("board.json", %{board: board}) do
    %{id: board.id, title: board.title}
  end

  def render("not-found.json", _params) do
    %{error: "Not found"}
  end

  def render("error.json", _params) do
    %{error: "Something went wrong"}
  end

end
