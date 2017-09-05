defmodule KanbanWeb.Api.V1.ViewHelpers do
  use KanbanWeb, :view

  def render("not-found.json", _params) do
    %{error: "Not found"}
  end

  def render("error.json", _params) do
    %{error: "Something went wrong"}
  end

  def render("missing-board.json", _params) do
    %{error: "Missing board"}
  end

  def render("missing-list.json", _params) do
    %{error: "Missing List"}
  end

end
