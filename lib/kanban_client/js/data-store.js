// import ListenerSupport from './listener-support';

// a little function to help us with reordering the result
function reorder(list, startIndex, endIndex) {
  var result = Array.from(list);
  var [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class DataStore {
  constructor() {
    this.store = new Map();
    this.store.set('boards', []);
    this.store.set('lists', []);
    this.store.set('cards', []);

    this.updateCard = this.updateCard.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  get(cacheKey) {
    return this.store.get(cacheKey);
  }

  getBoard(id) {
    return fetch('/api/v1/boards/' + id)
      .then(response => response.json())
      .then(json => {
        this.store.get("boards").push(json.data);
        return json.data;
      })
      .catch(console.error);
  }

  getLists(boardId) {
    return fetch("/api/v1/lists?board_id=" + boardId)
    .then(response => response.json())
    .then(json => {
      var lists = json.data;

      lists.sort((a, b) => a.row_order > b.row_order);

      lists.forEach(list => this.store.get("lists").push(list));

      return lists;
    })
    .catch(console.error);
  }

  getCards(listId) {
    return fetch("/api/v1/cards?list_id=" + listId)
      .then(response => response.json())
      .then(json => {
        var cards = json.data;

        cards.sort((a, b) => a.row_order > b.row_order);

        cards.forEach(card => this.store.get("cards").push(card));

        return cards;
      })
      .catch(console.error);
  }

  addCard(payload) {
    return fetch("/api/v1/cards", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: payload })
    })
    .then(response => response.json())
    .then(card => {
      this.store.get("cards").push(card.data);

      return card.data;
    })
    .catch(error => console.error(error));
  }

  updateCard(card) {
    var options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: card })
    };

    return fetch("/api/v1/cards/" + card.id, options)
      .then(response => response.json())
      .then(card => {
        var cards = this.store.get('cards').slice();

        for (let i = 0; i < cards.length; i += 1) {
          if (cards[i].id === card.data.id) {
            cards[i] = card.data; break;
          }
        }

        this.store.set("cards", cards);
      })
      .catch(error => console.error(error));
  }

  updateList(list) {
    var options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: list }) 
    };

    return fetch("/api/v1/lists/" + list.id, options)
      .then(response => response.json())
      .then(json => json.data)
      .catch(console.error)
  }

  persistListOrdering(oldLists, newLists) {
    newLists = newLists.map((c, idx) => Object.assign({}, c, { row_order: idx+1 }));

    for (let i = 0; i < oldLists.length; i += 1) {
      if (oldLists[i].id !== newLists[i].id) {
        this.updateList(newLists[i]);
      };
    }

    return newLists;
  }

  persistCardOrdering(cards) {
    var result = cards.map((c, idx) => Object.assign({}, c, { row_order: idx+1 }));
    
    for (let i = 0; i < cards.length; i += 1) {
      if (result[i].row_order !== cards[i].row_order) {
        this.updateCard(result[i]);
      }
    }

    return result; 
  }

  onDragEnd(result) {
    var collection;
    var oldCollection;
    var { destination, source, type, draggableId } = result;
    var { droppableId: dstDroppableId } = destination;
    var { droppableId: srcDroppableId } = source;

    if (dstDroppableId === srcDroppableId) {
      if (type === "COLUMN" && dstDroppableId.indexOf("BOARD-") === 0) {
        collection = this.swapListsInBoard(dstDroppableId, source, destination);
      }
      else if (type === "CARD" && dstDroppableId.indexOf("LIST-") === 0) {
        collection = this.swapCardsInList(dstDroppableId, source, destination);
      }
    }
    else {
      collection = this.swapCardBetweenLists(dstDroppableId, draggableId, destination.index);
    }

    return {
      type: type, 
      collection: collection
    };
  }

  swapCardBetweenLists(droppableId, draggableId, dstIndex) {
    draggableId = Number(draggableId.slice(5));
    droppableId = Number(droppableId.slice(5));

    var include = [];
    var exclude = [];
    var cards = this.store.get("cards");
    var card;

    for (let i = 0; i < cards.length; i += 1) {
      if (cards[i].id === draggableId) {
        card = Object.assign({}, cards[i], { list_id: droppableId });
      }
      else if (cards[i].list_id === droppableId) {
        include.push(cards[i]);
      }
      else {
        exclude.push(cards[i]);
      }
    }

    include.sort((a, b) => a.row_order > b.row_order);
    include.splice(dstIndex, 0, card);
    include = include.map((c, idx) => Object.assign({}, c, { row_order: idx+1 }));

    this.store.set("cards", exclude.concat(include));

    return this.store.get("cards");
  }

  swapListsInBoard(droppableId, source, destination) {
    var result, collection = this.store.get("lists");

    droppableId = Number(droppableId.slice(6));
    
    result = reorder( collection, source.index, destination.index );
    result = this.persistListOrdering(collection, result);

    this.store.set("lists", result);

    return result;
  }

  swapCardsInList(droppableId, source, destination) {
    droppableId = Number(droppableId.slice(5));
    
    var result;
    var cards = this.store.get('cards');
    var exclude = [];
    var include = [];

    for (let i = 0; i < cards.length; i += 1) {
      if (cards[i].list_id === droppableId) {
        include.push(cards[i]); 
      }
      else {
        exclude.push(cards[i]);
      }
    }

    include = reorder( include, source.index, destination.index );
    result = exclude.concat(include)
    this.store.set("cards", result);

    return result;
  }
}

var Store = (function IFFE() {
  var instance;

  return {
    init: function initializer(cacheKey) {
      if (!instance) {
        instance = new DataStore;
      }

      return instance;
    }
  }
})();

export default Store;