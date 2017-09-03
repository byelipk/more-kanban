defmodule KanbanWeb.V1.BoardsView do
  use KanbanWeb, :view

  def render("index.json", _params) do
    %{hello: "world"}
  end

end
