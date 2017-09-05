defmodule Kanban.Board do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban.{ Board, List }


  schema "boards" do
    field :title, :string
    has_many :lists, List

    timestamps()
  end

  @doc false
  def changeset(%Board{} = board, attrs) do
    board
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end
end
