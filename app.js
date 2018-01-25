$(document).ready(() => {

	let idCounter = 0;

	class App {
		constructor() {
			this.init();
			initSort();
		}

		init() {
			this.dialog();
		}

		dialog() {
			$('#dialog').dialog({
				autoOpen: false,
				modal: true,
				show: { effect: "fadeIn", duration: 800},
				hide: { effect: "fadeOut", duration: 800}
			});		  
			$('#dialog__tabs').tabs();	  
		}
	}

	class List {
		constructor(title, cards = []) {
			this.title = title;

			this.cards = [
				{id: "1", title: "card-1"},
				{id: "2", title: "card-2"},
				{id: "3", title: "card-3"},
			];

			this.init();
		}

		init() {
			this.render();
			// this.renderCards();
			this.listeners();
		}

		render() {
			const cards = this.cards.map(card => new Card(card));
			console.log(cards);
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
						<ul class="list__content">
							${cards}
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

		renderCards() {
			$.each(this.cards, (index, value) => {
				const card = new Card(this.cards[index].title);
			});
		}

		listeners() {
			$('.list__delete').on('click', e => {
				let target = e.target.closest('.column');
  				target.remove();
			});
			$('.list__new--card').last()
				.submit(e => {
					Handlers.newCard(e);
			});
		}

		update() {
			this.init()
			this.render();
		}

	}

	class Card {
		constructor(card) {
			this.card = card;
			this.init();
		}

		init() {
			this.render();
			this.listeners();
			$('.list__add')
				.find('input:text')
					.val('');
		}

		render() {
			const html = `
			<li class="list__content__card">
				${this.card}
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
				let target = $(e.target).closest('li');
  				target.remove();
			});
		}

		dialog() {

		}
	}

	const Handlers = {
		newCard: (e) => {
			e.preventDefault();
			const data = $(e.target).serializeArray();
			const newCard = new Card({
				id: idCounter,
				title: data[0].value
			});
			idCounter++;
		},
		newList: (e) => {
			e.preventDefault();
			const data = $(e.target).serializeArray();
			const newList = new List(data[0].value);
		}
	}

	// Initialize sorting on base columns and list
	const initSort = () => {
	    $(".section")
		    .sortable({
		      cursor: "move",
		      connectWith: ".section",
		      handle: ".list__header",
		      helper: "clone",
		      placeholder: "sortable-placeholder",
		      revert: true
		    })
		    .disableSelection();

	    $(".list__content")
		    .sortable({
		    	cursor: "move",
		    	connectWith: ".list__content"
		    })
		    .disableSelection();
  	}

  	//Listeners
  	$('.list__new--card').submit(e => {
  		Handlers.newCard(e);
  	});

  	$('.list__new--list').submit(e => {
		Handlers.newList(e);
		initSort();
  	});
  
	const app = new App();

});