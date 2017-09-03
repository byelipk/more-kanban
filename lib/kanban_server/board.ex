defmodule Kanban.Board do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban.Board


  schema "boards" do
    field :title, :string

    timestamps()
  end

  @doc false
  def changeset(%Board{} = board, attrs) do
    board
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end
end
