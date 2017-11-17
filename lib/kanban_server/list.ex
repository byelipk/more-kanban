defmodule Kanban.List do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban


  schema "lists" do
    field :name, :string
    field :row_order, :integer
    belongs_to :board, Kanban.Board
    has_many :cards, Kanban.Card

    timestamps()
  end

  @doc false
  def changeset(%Kanban.List{} = list, attrs) do
    list
    |> cast(attrs, [:name, :board_id, :row_order])
    |> validate_required([:name, :board_id, :row_order])
  end
end
