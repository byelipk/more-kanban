# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Kanban.Repo.insert!(%Kanban.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Kanban.{ Repo, Board, List, Card }

b1 = Repo.insert!(%Board{title: "Welcome to Kanban!"})

l1 = Repo.insert!(%List{name: "Get started", board: b1})
Repo.insert!(%List{name: "Questions about the event", board: b1})
Repo.insert!(%List{name: "What is Kanban?", board: b1})
Repo.insert!(%List{name: "Todo list", board: b1})

Repo.insert!(%Card{body: "Hello world how are you doing today when it is so beautiful outside like I've never see before?", list: l1})
Repo.insert!(%Card{body: "Boodbye world", list: l1})
Repo.insert!(%Card{body: "So long", list: l1})
Repo.insert!(%Card{body: "Farewell", list: l1})
Repo.insert!(%Card{body: "Let's go", list: l1})
