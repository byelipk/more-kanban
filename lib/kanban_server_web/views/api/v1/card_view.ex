defmodule KanbanWeb.Api.V1.CardView do
  use KanbanWeb, :view

  alias KanbanWeb.Api.V1.CardView

  def render("index.json", %{cards: cards}) do
    %{data: render_many(cards, CardView, "card.json"), type: "card"}
  end

  def render("show.json", %{card: card}) do
    %{data: render_one(card, CardView, "card.json"), type: "card"}
  end

  def render("card.json", %{card: card}) do
    %{id: card.id, body: card.body, list_id: card.list_id}
  end

  def render("missing-list.json", _params) do
    %{error: "Missing List"}
  end

  def render("missing-card.json", _params) do
    %{error: "Missing Card"}
  end

  def render("not-found.json", _params) do
    %{error: "Not found"}
  end

  def render("error.json", _params) do
    %{error: "Something went wrong"}
  end

end
