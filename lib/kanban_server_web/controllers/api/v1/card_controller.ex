defmodule KanbanWeb.Api.V1.CardController do
  use KanbanWeb, :controller

  alias Kanban.{ Repo, Card }

  import Ecto.Query, only: [from: 2]

  plug :find_card when action in [:delete, :update]

  def index(conn, params) do
    case params["list_id"] do
      nil ->
        conn
        |> put_status(404)
        |> render("missing-list.json")

      id  ->
        cards = Repo.all(from c in Card,
                         where: c.list_id == ^id)

        render conn, "index.json", cards: cards
    end
  end

  def create(conn, params) do
    changeset = Card.changeset(%Card{}, params["data"])

    case Repo.insert(changeset) do
      {:error, details } ->
        conn
        |> put_status(422)
        |> render("error.json", error: details)

      {:ok, card} ->
        conn
        |> put_status(201)
        |> render("show.json", card: card)
    end
  end

  def delete(conn, _params) do
    case Repo.delete(conn.assigns.card) do
      {:ok, _struct} ->
        conn
        |> send_resp(200, "")

      {:error, details} ->
        conn
        |> render("error.json", error: details)
    end
  end

  def update(conn, %{"id" => _id, "data" => attrs}) do
    changeset = Card.changeset(conn.assigns.card, attrs)

    case Repo.update(changeset) do
      { :ok, card } ->
        conn
        |> put_status(200)
        |> render("show.json", card: card)

      { :error, details } ->
        conn
        |> put_status(422)
        |> render("error.json", error: details)
    end
  end

  defp find_card(conn, _opts) do
    case Repo.get(Card, conn.params["id"]) do
      nil  ->
        conn
        |> put_status(404)
        |> render("missing-card.json")
        |> halt()

      card ->
        assign(conn, :card, card)
    end
  end

end
