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
      json.data.forEach(list => this.store.get("lists").push(list));
      return json.data;
    })
    .catch(console.error);
  }

  getCards(listId) {
    return fetch("/api/v1/cards?list_id=" + listId)
      .then(response => response.json())
      .then(json => {
        json.data.forEach(card => this.store.get("cards").push(card));
        return json.data;
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

  updateCard(card, value) {
    return fetch("/api/v1/cards/" + card.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: { body: value } })
    })
    .then(response => response.json())
    .then(updatedCard => {
      var cards = this.store.get('cards');
      for (let i = 0; i < cards.length; i += 1) {
        if (cards[i].id === updatedCard.id) {
          cards[i] = updatedCard;
        }
      }
      return updatedCard.data;
    })
    .catch(error => console.error(error));
  }


  onDragEnd(result) {
    var collection;
    var { destination, source, type, draggableId } = result;
    
    // dropped outside the list
    if (!destination) {
      return;
    }
  
    else if (destination.droppableId === source.droppableId) {
      var { droppableId } = destination;

      if (type === "COLUMN" && droppableId.indexOf("BOARD-") === 0) {
        collection = this.swapListsInBoard(droppableId, source, destination);
      }
      else if (type === "CARD" && droppableId.indexOf("LIST-") === 0) {
        collection = this.swapCardsInList(droppableId, source, destination);
      }
    }
    else {
      collection = this.swapCardBetweenLists(droppableId, draggableId, destination);
    }

    return {
      type: type, 
      collection: collection
    };
  }

  swapCardBetweenLists(droppableId, draggableId, destination) {
    draggableId = Number(draggableId.slice(5));
    droppableId = Number(destination.droppableId.slice(5));

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

    include.splice(destination.index, 0, card);

    this.store.set("cards", exclude.concat(include));

    return this.store.get("cards");
  }

  swapListsInBoard(droppableId, source, destination) {
    var result;

    droppableId = Number(droppableId.slice(6));
    
    result = reorder( this.store.get('lists'), source.index, destination.index );

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