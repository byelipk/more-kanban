defmodule Kanban.Card do
  use Ecto.Schema
  import Ecto.Changeset
  alias Kanban.Card


  schema "cards" do
    field :body, :string
    belongs_to :list, Kanban.List

    timestamps()
  end

  @doc false
  def changeset(%Card{} = card, attrs) do
    card
    |> cast(attrs, [:body])
    |> validate_required([:body])
  end
end
