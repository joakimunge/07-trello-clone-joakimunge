$(document).ready(() => {

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
			//Listeners
			this.render();
		}

		render() {
			//Render cards, then attach?
			const cards = this.cards.map(card => new Card(card)).join("");
			const html =  `
				<div class="section column">
					<div class="list">
						<div class="list__header">
							${this.title}
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

		update() {
			this.init()
			this.render();
		}

	}

	class Card {
		constructor(card) {
			this.card = card;
			this.init()
		}

		init() {
			//Listeners
			this.render();
			$('.list__add')
				.find('input:text')
					.val('');
		}

		render() {
			return `
			<li class="list__content__card">
				${this.card}
				<span class="card__delete">
					<i class="fa fa-times" aria-hidden="true">
					</i>
				</span>
			</li>
			`
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

  	//Card handlers
  	const newCardHandler = (e) => {
  		e.preventDefault();
  		const data = $(e.target).serializeArray();
  		let newCard = `
  			<li class="list__content__card">
        		${data[0].value}
        		<span class="card__delete">
        			<i class="fa fa-times" aria-hidden="true">
        			</i>
        		</span>
			</li>	
		`

		$('.list__add')
			.find('input:text')
				.val('');

		const target = 
			$(e.target)
				.closest('.list')
					.find('.list__content');

    	target.append(newCard);

    	newCard = target.find('.card__delete').last();

    	$(newCard).on('click', e => {
  			deleteCardHandler(e);
  		});
  	}

  	const deleteCardHandler = (e) => {
  		let target = e.target;
  		target = target.closest('li.list__content__card');
  		target.remove();
  	}

  	$('.card__delete').on('click', e => {
  		deleteCardHandler(e);
  	});

  	$('.list__new--card').submit(e => {
  		newCardHandler(e);
  	});

  	//List handlers
  	$('.list__new--list')
  		.submit(e => {
			e.preventDefault();
			const data = $(e.target).serializeArray();
			const newList = new List(data[0].value);
			console.log(newList);

		$('.column').last().before();

		$('.list__new--card')
			.last()
				.submit(e => {
					newCardHandler(e);
		});

		initSort();
  	});
  
  	initSort();

});