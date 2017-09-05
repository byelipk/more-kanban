defmodule KanbanWeb.Api.V1.BoardControllerTest do
  use KanbanWeb.ConnCase

  import Kanban.Factory

  alias KanbanWeb.Api.V1.{ BoardView }

  describe "GET /" do

    test "it returns a collection of Boards", %{conn: conn} do
      insert(:board)
      insert(:board)

      conn =
        conn
        |> get(api_v1_board_path(conn, :index))

      assert json_response(conn, 200) == render_json(BoardView, "index.json", conn.assigns)
    end

  end


  describe "GET /:id" do

    test "it returns a sigle Board", %{conn: conn} do
      article_1 = insert(:board)

      conn =
        conn
        |> get(api_v1_board_path(conn, :show, article_1.id))

      assert json_response(conn, 200) == render_json(BoardView, "show.json", conn.assigns)
    end

    test "it returns 404 when Board is not found", %{conn: conn} do
      conn =
        conn
        |> get(api_v1_board_path(conn, :show, 123))

      assert json_response(conn, 404) == render_json(BoardView, "not-found.json", conn.assigns)
    end

  end

  describe "POST /" do

    test "it returns a new Board when user submits valid attributes", %{conn: conn} do
      conn =
        conn
        |> post(api_v1_board_path(conn, :create, %{data: %{title: "Nice"}}))

      assert json_response(conn, 201) == render_json(BoardView, "show.json", conn.assigns)
    end

    test "it returns an error when user submits invalid attributes", %{conn: conn} do
      conn =
        conn
        |> post(api_v1_board_path(conn, :create, %{data: %{hack: "Nice"}}))

      assert json_response(conn, 422) == render_json(BoardView, "error.json", conn.assigns)
    end

  end

  describe "DELETE /:id" do

    test "it returns 200 OK", %{conn: conn} do
      article_1 = insert(:board)

      conn =
        conn
        |> get(api_v1_board_path(conn, :delete, article_1.id))

      assert json_response(conn, 200)
    end

    test "it returns 404 when Board is not found", %{conn: conn} do
      conn =
        conn
        |> get(api_v1_board_path(conn, :delete, 123))

      assert json_response(conn, 404)
    end

  end

  describe "PUT /:id" do

    test "it returns 200 OK", %{conn: conn} do
      article_1 = insert(:board)

      conn =
        conn
        |> put(api_v1_board_path(
          conn, :update, article_1.id, %{data: %{title: "This town rocks!"}}))

      assert json_response(conn, 200)
    end

    test "it updates the correct property", %{conn: conn} do
      article_1 = insert(:board)

      response =
        conn
        |> put(api_v1_board_path(conn, :update, article_1.id, %{data: %{title: "This town rocks!"}}))
        |> json_response(200)

      assert response["data"]["title"] === "This town rocks!"
    end

    test "it returns 404 when Board is not found", %{conn: conn} do
      conn =
        conn
        |> get(api_v1_board_path(conn, :update, 123))

      assert json_response(conn, 404)
    end

    test "it does not modify record when params are incorrect", %{conn: conn} do
      board = insert(:board)

      response =
        conn
        |> put(api_v1_board_path(conn, :update, board.id, %{data: %{hacked: "This town rocks!"}}))
        |> json_response(200)

      assert response["data"]["title"] === board.title
    end
  end

end
