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

  def card_factory do
    %Kanban.Card{
      body: sequence(:body, &("Here is my body #{&1}")),
      list: build(:list)
    }
  end

end
