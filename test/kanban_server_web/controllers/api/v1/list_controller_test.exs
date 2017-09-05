defmodule KanbanWeb.Api.V1.ListControllerTest do
  use KanbanWeb.ConnCase

  import Kanban.Factory

  alias KanbanWeb.Api.V1.{ ListView }

  describe "GET /?board_id=xxx" do

    test "it returns a collection of Lists", %{conn: conn} do
      list = insert(:list)

      conn =
        conn
        |> get(api_v1_list_path(conn, :index, %{board_id: list.board.id}))

      assert json_response(conn, 200) == render_json(ListView, "index.json", conn.assigns)
    end

    test "it returns 404 when board_id is missing", %{conn: conn} do
      conn =
        conn
        |> get(api_v1_list_path(conn, :index))

      assert json_response(conn, 404) == render_json(ListView, "missing-board.json", conn.assigns)
    end

  end


  # describe "GET /:id" do
  #
  #   test "it returns a sigle Board", %{conn: conn} do
  #     article_1 = insert(:board)
  #
  #     conn =
  #       conn
  #       |> get(api_v1_list_path(conn, :show, article_1.id))
  #
  #     assert json_response(conn, 200) == render_json(ListView, "show.json", conn.assigns)
  #   end
  #
  #   test "it returns 404 when Board is not found", %{conn: conn} do
  #     conn =
  #       conn
  #       |> get(api_v1_list_path(conn, :show, 123))
  #
  #     assert json_response(conn, 404) == render_json(ListView, "not-found.json", conn.assigns)
  #   end
  #
  # end
  #
  describe "POST /" do

    test "it returns a new List when attributes are valid", %{conn: conn} do
      board = insert(:board)

      conn =
        conn
        |> post(api_v1_list_path(conn, :create, %{data: %{name: "Nice List", board_id: board.id}}))

      assert json_response(conn, 201) == render_json(ListView, "show.json", conn.assigns)
    end

    test "it returns 404 when board_id is missing", %{conn: conn} do
      conn =
        conn
        |> post(api_v1_list_path(conn, :create, %{data: %{name: "Nice"}}))

      assert json_response(conn, 404) == render_json(ListView, "missing-board.json", conn.assigns)
    end

    test "it returns 422 when attributes are invalid", %{conn: conn} do
      board = insert(:board)

      conn =
        conn
        |> post(api_v1_list_path(conn, :create, %{data: %{hack: "Nice", board_id: board.id}}))

      assert json_response(conn, 422) == render_json(ListView, "error.json", conn.assigns)
    end

  end

  describe "DELETE /:id" do

    test "it returns 200 OK", %{conn: conn} do
      list = insert(:list)

      conn =
        conn
        |> delete(api_v1_list_path(conn, :delete, list.id))

      assert response(conn, 200)
    end

    test "it returns 404 when List is not found", %{conn: conn} do
      conn =
        conn
        |> delete(api_v1_list_path(conn, :delete, 123))

      assert response(conn, 404)
    end

  end
  #
  # describe "PUT /:id" do
  #
  #   test "it returns 200 OK", %{conn: conn} do
  #     article_1 = insert(:board)
  #
  #     conn =
  #       conn
  #       |> put(api_v1_list_path(
  #         conn, :update, article_1.id, %{data: %{title: "This town rocks!"}}))
  #
  #     assert json_response(conn, 200)
  #   end
  #
  #   test "it updates the correct property", %{conn: conn} do
  #     article_1 = insert(:board)
  #
  #     response =
  #       conn
  #       |> put(api_v1_list_path(conn, :update, article_1.id, %{data: %{title: "This town rocks!"}}))
  #       |> json_response(200)
  #
  #     assert response["data"]["title"] === "This town rocks!"
  #   end
  #
  #   test "it returns 404 when Board is not found", %{conn: conn} do
  #     conn =
  #       conn
  #       |> get(api_v1_list_path(conn, :update, 123))
  #
  #     assert json_response(conn, 404)
  #   end
  #
  #   test "it does not modify record when params are incorrect", %{conn: conn} do
  #     board = insert(:board)
  #
  #     response =
  #       conn
  #       |> put(api_v1_list_path(conn, :update, board.id, %{data: %{hacked: "This town rocks!"}}))
  #       |> json_response(200)
  #
  #     assert response["data"]["title"] === board.title
  #   end
  # end

end
