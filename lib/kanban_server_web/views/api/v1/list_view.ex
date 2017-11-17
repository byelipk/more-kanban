defmodule KanbanWeb.Api.V1.ListView do
  use KanbanWeb, :view

  alias KanbanWeb.Api.V1.ListView

  def render("index.json", %{lists: lists}) do
    %{data: render_many(lists, ListView, "list.json"), type: "list"}
  end

  def render("show.json", %{list: list}) do
    %{data: render_one(list, ListView, "list.json"), type: "list"}
  end

  def render("list.json", %{list: list}) do
    %{id: list.id, name: list.name, board_id: list.board_id}
  end

  def render("missing-board.json", _params) do
    %{error: "Missing board"}
  end

  def render("missing-list.json", _params) do
    %{error: "Missing List"}
  end

  def render("not-found.json", _params) do
    %{error: "Not found"}
  end

  def render("error.json", _params) do
    %{error: "Something went wrong"}
  end

end
