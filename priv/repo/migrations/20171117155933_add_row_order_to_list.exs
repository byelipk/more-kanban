defmodule Kanban.Repo.Migrations.AddRowOrderToList do
  use Ecto.Migration

  def change do
    alter table("lists") do
      add :row_order, :integer 
    end
  end
end
