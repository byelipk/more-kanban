defmodule Kanban.Card do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban.Card


  schema "cards" do
    field :body, :string
    field :row_order, :integer
    belongs_to :list, Kanban.List

    timestamps()
  end

  @doc false
  def changeset(%Card{} = card, attrs) do
    card
    |> cast(attrs, [:body, :list_id, :row_order])
    |> validate_required([:body, :list_id, :row_order])
  end
end
