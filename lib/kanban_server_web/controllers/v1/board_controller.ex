defmodule KanbanWeb.V1.BoardController do
  use KanbanWeb, :controller

  alias Kanban.{ Repo, Board }

  plug :fetch_board when action in [:delete]

  def index(conn, _params) do
    render conn, "index.json", boards: Repo.all(Board)
  end

  def show(conn, %{"id" => id}) do
    case Repo.get(Board, id) do
      nil   ->
        conn
        |> put_status(404)
        |> render("not-found.json")

      board ->
        render conn, "show.json", board: board
    end
  end

  def create(conn, %{"data" => params}) do
    changeset = Board.changeset(%Board{}, params)

    case Repo.insert(changeset) do
      {:error, details } ->
        conn
        |> put_status(422)
        |> render("error.json", error: details)

      {:ok, board } ->
        conn
        |> put_status(201)
        |> render("show.json", board: board)
    end
  end

  def delete(conn, _params) do
    case Repo.delete(conn.board) do
      {:ok, _struct} ->
        conn
        |> send_resp(200, "")

      {:error, changeset} ->
        conn
        |> render("error.json", error: changeset)
    end
  end

  def fetch_board(conn, %{"id" => id}) do
    case Repo.get(Board, id) do
      nil ->
        conn
        |> put_status(404)
        |> render("not-found.json")

      {:ok, board} ->
        assign(conn, :board, board)
    end
  end

end
