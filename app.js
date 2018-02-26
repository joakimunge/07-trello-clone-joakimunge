$(document).ready(() => {

	class State {
		constructor(board) {
			const localStorage = window.localStorage;
			const name = "trello-clone";
			this.defaultState = {
		      lists: [
		        {
		          id: 0,
		          title: "Todo",
		          cards: [
		            {
		              id: 4,
		              title: "Card in todo"
		            },
		            {
		              id: 5,
		              title: "Card #2 in todo"
		            }
		          ]
		        },
		        {
		          id: 1,
		          title: "In progress",
		          cards: [
		            {
		              id: 6,
		              title: "Card in progress"
		            }
		          ]
		        },
		        {
		          id: 2,
		          title: "Done",
		          cards: [
		            {
		              id: 7,
		              title: "Card in done"
		            }
		          ]
		        }
		      ]
		    };

		    this.getBoardState();

		}

		getBoardState() {
	      return JSON.parse(localStorage.getItem(name)) || this.defaultState;
	    };

	    setBoardState(board) {
	      return localStorage.setItem(name, JSON.stringify((board = board)));
	    };
	}

	class App {
		constructor(state) {
			this.store = state;
			this.state = state.getBoardState();
			this.newCard = this.newCard.bind(this);
			this.newList = this.newList.bind(this);
			this.init();
		}

		init() {
			this.render();
			this.listeners();
			this.sortable();
		}

		listeners() {
			$('.list__new--list').submit(e => {
				e.preventDefault();
				this.newList(e);
				this.sortable();
  			});
			$('#reset').on('click', (e) => {
				this.store.setBoardState(this.store.defaultState);
				location.reload();
			});
			$('#manowar').on('click', (e) => {
				$.manowar.lyrics();
			})
		}

		newList(e) {
			const data = $(e.target).serializeArray();
			const id = this.getLatestId(this.state) + 1;
			const newList = new List(id, data[0].value, [], this);
			const listObj = {id: id, title: data[0].value, cards: []};
			let newState = this.state;
			newState.lists.push(listObj);
			this.store.setBoardState(newState);
		}

		newCard(e) {
			const data = $(e.target).serializeArray();
			const id = this.getLatestId(this.state) + 1;
			const newCard = new Card({
				id: id,
				title: data[0].value
			});
			const cardObj = {id: id, title: data[0].value};
			const list = $(e.target).parents().closest('.list').find('ul[data-id]');
			const listId = list.data('id');
			let newState = this.state;
			$.each(newState.lists, (key, value) => {
				if (newState.lists[key].id === listId) {
						newState.lists[key].cards.push(cardObj);
				};
			})
			this.store.setBoardState(newState);
		}

		sortable() {
					$('.board').sortable({
						cursor: "move",
						revert: "true",
						placeholder: "sortable-placeholder",
						forcePlaceholderSize: true,
						start: function(event, ui) {
							ui.placeholder.height(ui.item.find('.list').height());
						}
					})
					.disableSelection();
						
			    $(".list__content")
				    .sortable({
				    	cursor: "move",
				    	connectWith: ".list__content",
				    	helper: "clone",
				    	placeholder: "list__content__card--placeholder",
				    	revert: true
				    })
				    .disableSelection();
		}

		render() {
			$.each(this.state.lists, (( key, value ) => {
			  const list = new List(value.id, value.title, value.cards, this);
			}));
		}

		getLatestId(state) {
		    let id = -1;

		    state.lists.forEach(list => {
		      list.cards.forEach(card => {
		        if (card.id > id) {
		          id = card.id;
		        }
		      });
		      if(list.id > id) {
		      	id = list.id;
		      }
		    });

		    return id;
		  }

	}

	class List {
		constructor(id, title, cards = [], caller) {
			this.id = id;
			this.title = title;
			this.cards = cards;
			this.caller = caller;
			this.init();
		}

		init() {
			this.render();
			this.listeners();
		}

		render() {
			const cards = this.cards.map(card => new Card(card, this.caller));
			const html =  `
				<div class="section column">
					<div class="list">
						<div class="list__header">
							${this.title}
							<span class="list__delete">
								<i class="fa fa-times" aria-hidden="true">
								</i>
							</span>
						</div>
						<ul class="list__content" data-id="${this.id}">
							${cards.map(card => card.fragment).join("")}						
						</ul>
						<ul class="input">
							<li class="list__new--card">
								<form class="field list__add" action="index.html">
									<input type="text" name="title" placeholder="Add new card.." autocomplete="off" />
								</form>
							</li>
						</ul>
					</div>
				</div>
			`
			$('.column').last().before(html);
		}

		listeners() {
			$('.list__delete').on('click', e => {
				let target = e.target.closest('.column');
  				target.remove();
  				e.stopImmediatePropagation();
  				console.log(this.caller.state);
			});

			$('.list__new--card').last().submit(e => {
				e.preventDefault();
				this.caller.newCard(e);
			});
		}

		update() {
			this.init()
			this.render();
		}

	}

	class Card {
		constructor(card, caller) {
			this.card = card;
			this.target = 'li[data-id=' + this.card.id + ']';
			this.caller = caller;
			this.init();
			this.fragment = this.render(); // slighjtly icky
		}

		init() {
			this.listeners();
			$('.list__add')
				.find('input:text')
					.val('');
		}

		render() {
			const html = `
				<li class="list__content__card" data-id="${this.card.id}">
					${this.card.title}
					<span class="card__delete">
						<i class="fa fa-times" aria-hidden="true">
						</i>
					</span>
				</li>
			`
			const target = $(':focus').closest('.list').children('.list__content');
			target.append(html);
			return html;
		}

		listeners() {
			$('body').on('click', '.card__delete', (e) => {
				e.stopPropagation();
				let target = $(e.target).closest('li');
  				target.remove();
			});

			$('body').on('click', this.target, (e) => {
				e.stopImmediatePropagation();
				let modal = new Modal(this.card);
			});
		}
	}

	class Modal {
		constructor(card) {
			this.card = card;
			this.title = card.title;
			this.init();
			this.modal = $('.modal');
		}

		init() {
			this.render();
			this.listeners();
			this.setTabs();
			this.setDatepicker();
		}

		listeners() {
			$('body').on('click', '.modal__close', (e) => {
				this.modal.remove();
			});
		}

		setTabs() {
			console.log(this.card);
			$( function() {
		    $( "#tabs" ).tabs();
		  } );
		}

		setDatepicker() {
			$( function() {
		    $( "#datepicker" ).datepicker();
		  } );
		}

		render() {
			const modal = `
				<div class="modal">
					<div class="modal__content">
			            <div class="modal__header">
			                <h1>${this.title}</h1>
			                <span class="modal__close">
								<i class="fa fa-times" aria-hidden="true">
								</i>
							</span>
			            </div>
			            <div id="tabs" class="modal__body">
			                <ul>
										    <li><a href="#tabs-1">Tab 1</a></li>
										    <li><a href="#tabs-2">Tab 2</a></li>
										    <li><a href="#tabs-3">Tab 3</a></li>
										  </ul>
										  <div id="tabs-1">
										    <p>TAB 1</p>
										  </div>
										  <div id="tabs-2">
										    <p>TAB 2</p>
										  </div>
										  <div id="tabs-3">
										    <p>TAB 3</p>
										  </div>
			            </div>
			            <div class="modal__footer">
			               <p>Due date: <input type="text" id="datepicker"></p>
			            </div>
			        </div>
			        <div class="modal__overlay"></div>
			    </div>
	        `
		    $('body').append(modal);
		}

	}

	const state = new State();
	const app = new App(state);

});