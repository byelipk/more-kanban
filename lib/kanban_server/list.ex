defmodule Kanban.List do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban.{ List, Board }


  schema "lists" do
    field :name, :string
    belongs_to :board, Board

    timestamps()
  end

  @doc false
  def changeset(%List{} = list, attrs) do
    list
    |> cast(attrs, [:name])
    |> validate_required([:name, :board_id])
  end
end
