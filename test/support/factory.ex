defmodule Kanban.Factory do
  # with Ecto
  use ExMachina.Ecto, repo: Kanban.Repo

  def board_factory do
    %Kanban.Board{
      title: sequence(:title, &("Board #{&1}"))
    }
  end

  def list_factory do
    %Kanban.List{
      name: sequence(:name, &("List number #{&1}")),
      board: build(:board)
    }
  end

end
