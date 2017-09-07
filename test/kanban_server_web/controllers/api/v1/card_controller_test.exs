defmodule KanbanWeb.Api.V1.CardControllerTest do
  use KanbanWeb.ConnCase

  import Kanban.Factory

  alias KanbanWeb.Api.V1.{ CardView }

  describe "GET /?board_id=xxx" do

    test "it returns a collection of Cards", %{conn: conn} do
      list  = insert(:list)
      insert_list(3, :card, %{list: list})

      conn =
        conn
        |> get(api_v1_card_path(conn, :index, %{list_id: list.id}))

      assert json_response(conn, 200) == render_json(CardView, "index.json", conn.assigns)
    end

    test "it returns 404 when list_id is missing", %{conn: conn} do
      conn =
        conn
        |> get(api_v1_card_path(conn, :index))

      assert json_response(conn, 404) == render_json(CardView, "missing-list.json", conn.assigns)
    end

  end

  describe "POST /" do

    test "it returns a new Card when attributes are valid", %{conn: conn} do
      list = insert(:list)

      conn =
        conn
        |> post(api_v1_card_path(conn, :create, %{data: %{body: "Nice card", list_id: list.id}}))

      assert json_response(conn, 201) == render_json(CardView, "show.json", conn.assigns)
    end

    test "it returns 422 when attributes are invalid", %{conn: conn} do
      conn =
        conn
        |> post(api_v1_card_path(conn, :create, %{data: %{body: "Nice"}}))

      assert json_response(conn, 422) == render_json(CardView, "error.json", conn.assigns)
    end

  end

  describe "DELETE /:id" do

    test "it returns 200 OK", %{conn: conn} do
      card = insert(:card)

      conn =
        conn
        |> delete(api_v1_card_path(conn, :delete, card.id))

      assert response(conn, 200)
    end

    test "it returns 404 when Card is not found", %{conn: conn} do
      conn =
        conn
        |> delete(api_v1_card_path(conn, :delete, 123))

      assert response(conn, 404)
    end

  end

  describe "PUT /:id" do

    test "it returns 200 OK", %{conn: conn} do
      card = insert(:card)

      conn =
        conn
        |> put(api_v1_card_path(conn, :update, card.id, %{data: %{body: "Update", list_id: card.list_id}}))

      assert json_response(conn, 200) == render_json(CardView, "show.json", conn.assigns)
    end

    test "it returns 404 when Card is not found", %{conn: conn} do
      conn =
        conn
        |> put(api_v1_card_path(conn, :update, 123))

      assert json_response(conn, 404)
    end

    test "it does not modify record when params are incorrect", %{conn: conn} do
      card = insert(:card)

      response =
        conn
        |> put(api_v1_card_path(conn, :update, card.id, %{data: %{hacked: "This town rocks!"}}))
        |> json_response(200)

      assert response["data"]["body"] === card.body
    end
  end

end
