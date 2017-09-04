defmodule Kanban.Factory do
  # with Ecto
  use ExMachina.Ecto, repo: Kanban.Repo

  def board_factory do
    %Kanban.Board{
      title: sequence(:title, &("Board #{&1}"))
    }
  end

end
