defmodule Kanban.List do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban


  schema "lists" do
    field :name, :string
    belongs_to :board, Kanban.Board
    has_many :cards, Kanban.Card

    timestamps()
  end

  @doc false
  def changeset(%Kanban.List{} = list, attrs) do
    list
    |> cast(attrs, [:name, :board_id])
    |> validate_required([:name, :board_id])
  end
end
