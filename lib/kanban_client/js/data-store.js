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
    this.store.set('boards', new Set());
    this.store.set('lists', []);
    this.store.set('cards', []);
  }

  getBoard(id) {
    return fetch('/api/v1/boards/' + id)
      .then(response => response.json())
      .then(json => {
        this.push("boards", json.data);
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

  push(type, data) {
    this.store.get(type).add(data);
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
        droppableId = Number(droppableId.slice(6));

        collection = reorder( 
          this.store.get('lists'), 
          source.index, 
          destination.index 
        );

        this.store.set("lists", collection);
      }
      else if (type === "CARD" && droppableId.indexOf("LIST-") === 0) {
        droppableId = Number(droppableId.slice(5));
        var listCards = this.store.get('cards').filter(c => c.list_id === droppableId);
        listCards = reorder(
          listCards,
          source.index,
          destination.index
        );
        collection = this.store.get('cards').filter(c => c.list_id !== droppableId);
        collection = collection.concat(listCards);
        this.store.set("cards", collection);
      }
    }

    else {
      console.log("SHUFFLE CARDS AND LISTS")
    }

    return {
      type: type, 
      collection: collection
    };
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