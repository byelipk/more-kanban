defmodule Kanban.Repo.Migrations.AddRowOrderToCard do
  use Ecto.Migration

  def change do
    alter table("cards") do
      add :row_order, :integer 
    end
  end
end
