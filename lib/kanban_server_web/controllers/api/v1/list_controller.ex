defmodule KanbanWeb.Api.V1.ListController do
  use KanbanWeb, :controller

  import Ecto.Query, only: [from: 2]

  alias Kanban.{ Repo, List, Board }

  plug :verify_board_id when action in [:index, :create]
  plug :find_board      when action in [:create]
  plug :find_list       when action in [:delete, :update, :show]

  def index(conn, _params) do
    lists = Repo.all(from l in List,
                     where: l.board_id == ^conn.assigns.board_id)

    render conn, "index.json", lists: lists
  end

  def show(conn, _params) do
    render conn, "show.json", list: conn.assigns.list
  end

  def create(conn, params) do
    changeset = List.changeset(%List{}, params["data"])

    case Repo.insert(changeset) do
      {:error, details } ->
        conn
        |> put_status(422)
        |> render("error.json", error: details)

      {:ok, list} ->
        conn
        |> put_status(201)
        |> render("show.json", list: list)
    end
  end

  def delete(conn, _params) do
    case Repo.delete(conn.assigns.list) do
      {:ok, _struct} ->
        conn
        |> send_resp(200, "")

      {:error, details} ->
        conn
        |> render("error.json", error: details)
    end
  end

  def update(conn, %{"id" => _id, "data" => attrs}) do
    changeset = List.changeset(conn.assigns.list, attrs)

    case Repo.update(changeset) do
      { :ok, list } ->
        conn
        |> put_status(200)
        |> render("show.json", list: list)

      { :error, details } ->
        conn
        |> put_status(422)
        |> render("error.json", error: details)
    end

  end

  defp verify_board_id(conn, _) do
    board_id = conn.params["board_id"] || conn.params["data"]["board_id"]
    case board_id do
      nil   -> missing_board(conn)
      board -> assign(conn, :board_id, board)
    end
  end

  defp find_board(conn, _) do
    case Repo.get(Board, conn.assigns.board_id) do
      nil   -> missing_board(conn)
      board -> assign(conn, :board, board)
    end
  end

  defp find_list(conn, _opts) do
    case Repo.get(List, conn.params["id"]) do
      nil  ->
        conn
        |> put_status(404)
        |> render("missing-list.json")
        |> halt()

      list -> assign(conn, :list, list)
    end
  end

  defp missing_board(conn) do
    conn
    |> put_status(404)
    |> render("missing-board.json")
    |> halt()
  end

end
