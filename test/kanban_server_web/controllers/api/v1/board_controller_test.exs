defmodule KanbanWeb.Api.V1.BoardControllerTest do
  use KanbanWeb.ConnCase

  import Kanban.Factory

  alias KanbanWeb.V1.{ BoardView }

  describe "GET /" do

    test "it returns a collection of Boards", %{conn: conn} do
      insert(:board)
      insert(:board)

      conn =
        conn
        |> get(v1_board_path(conn, :index))

      assert json_response(conn, 200) == render_json(BoardView, "index.json", conn.assigns)
    end

  end


  describe "GET /:id" do

    test "it returns a sigle Board", %{conn: conn} do
      article_1 = insert(:board)

      conn =
        conn
        |> get(v1_board_path(conn, :show, article_1.id))

      assert json_response(conn, 200) == render_json(BoardView, "show.json", conn.assigns)
    end

    test "it returns 404 when Board is not found", %{conn: conn} do
      conn =
        conn
        |> get(v1_board_path(conn, :show, 123))

      assert json_response(conn, 404) == render_json(BoardView, "not-found.json", conn.assigns)
    end

  end

  describe "POST /" do

    test "it returns a new Board when user submits valid attributes", %{conn: conn} do
      conn =
        conn
        |> post(v1_board_path(conn, :create, %{data: %{title: "Nice"}}))

      assert json_response(conn, 201) == render_json(BoardView, "show.json", conn.assigns)
    end

    test "it returns an error when user submits invalid attributes", %{conn: conn} do
      conn =
        conn
        |> post(v1_board_path(conn, :create, %{data: %{hack: "Nice"}}))

      assert json_response(conn, 422) == render_json(BoardView, "error.json", conn.assigns)
    end

  end

end
