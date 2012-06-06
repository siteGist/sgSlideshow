function ImportJavaScript(sourceUrl) { // функція імпорування Джава Сриптів
		var scriptElem = document.createElement('script');
		scriptElem.src = sourceUrl;
		scriptElem.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(scriptElem);
}

(function($) {
	jQuery.fn.removeObjReturnHTML= function() { // Видаляє елемент, повертаючи його код
		return $('<a></a>').append( this.remove().clone() ).remove().html();
	}
	
	var easingLoaded = false, jqueryUILoaded = false; // Для перевірки снування включених файлів
	$.fn.sgSlideshow = function(params){
		var p = { // Типові налаштування
		/*********************
		 * ЗАГАЛЬНІ ПАРАМЕТРИ
		 */
		// автоматичний показ наступного слайду
			autoNext: true,
		// при досягненні зупинити автопрокрутку - last, first, (int)N - або ігнорувати якщо false
			// endAutoNext: 'last',
		// режим показу слайдів - staticly, scroll
			mode: 'staticly',
			staticly: {
				hideTime: 300,
				showTime: 500,
				easing: 'linear',
			// в цьому режимі всі слайди ховаютсья й показуютсья поперемінно, тут вказуємо час показу першого слайду
				firstSlideShowtime: 4747
				//, UIeffect: 'fade' //! згодом можемо добавити можливість користуватись jQueryUI еффектами
			},
			scroll: {
				vertical: false,
				speed: 777,
				easing: 'linear',
			/** Як відображати прокрутку ленти з одиницями/елементами слайдшоу - tocurrent|inline|full
				 * tocurrent	- відображати тільки перехід від поточного до обраного елемента
				 * inline		- відображати усі елементи при переході, але не відображати при переході між першим та останніми елементами
				 * full			- постійний показ усієї лінії елементів
			 */
				itemsLine: 'inline',
				carousell: {
					enable: false,
				// копіювати кількість елементів - 'full' якщо скопіювати ленту повністю, або (int)Number для задання кількості
				// знадобиться коли необхідно показувати ленту поза межі обмежувача
					copy: 1,
					oneDirection: false
				}
			},
		// робити анімацію тільки по її завершенні
			animateWhenShowEnds: false,
		// почати показ з N-ого елементу
			firstSlide: 1,
		// Умови закінчення слайду, можна вказати перебіг слайдшоу, або останній слайд
			stopSlide: null,
		// Також повторюємо слайди - true, (int)N, false
			repeatStopSlide: true,
		// час показу одного слайду - у мілісекундах
			showTime: 3000,
		/* налаштування затримки показу слайду */
			delay: {
				enable: true,
				// задіяти затримку часу при показі конкретного слайду, при виклику показати наступний/попередній слайд
				enableOn: 'exactslide shownext showprev',
				// продовження часу показу обраного слайду
				multiplyTime: 3
			},
		// показ слайдів у зворотньому порядку
			reverse: false,
		// каркас будуємо скриптом? 
			buildHTML: false,
		// якщо '' тоді всі дочірні елементи стануть одиницями слайдера, інакше будуть обрані ел. конкретного класу
			wrapSelector: '',
		// назва класів для обгортки каркасу ХТМЛ структури слайдера, це більш необхідно коли каркас будується динамічно
			carcass: {
				container: 'container',
				wrapper: 'wrapper',
				itemHolder: 'item-holder',
				item: 'item',
				current: 'cur'
			},
			addSizeToHolder: 0,
		// Бібліотеки для еффектів
			jlibs: {
				easing: 'http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js',
				jqueryUI: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js'
			},
		/************************************************
		 * Функції відгуку
		 */
			onSlideChange: function(n){},
			onStart: function(){},
			onStartAnimation: function(){},
			onEndAnimation: function(){},
			onSlideRepeatStarts: function() {}, // when _slideshowGo starts at first step
			onSlideRepeatEnds: function() {}, // when _slideshowGo finished the last step
		/************************************************
		 * Кнопочки
		 */
			buttons: {
				use: true,
				pages: true,
				next: true,
				prev: true,
			// що показуємо/ховаємо - all|none|pages|next|prev|next&prev
				hideshow: 'none',
			// робити зміну слайдів при таких подіях
				actionOn: 'click',
			// налаштування подій
				bind: {
					hideOn: 'mouseleave',
					showOn: 'mouseenter',
			// тут теж треба зробити варіанти із jQueryUI
					hideStyle: 'fade',
					showStyle: 'fade'
				},
			// час приховування/показу елементів
				hideTime: 300,
				showTime: 500,
				bttnClass: {
					bttnWrap: 'show-navi',
					pages: 'show-item',
					next: 'show-next',
					prev: 'show-prev',
					nextText: '›',
					prevText: '‹',
					separate: true
				}
			},
		/************************************************
		 * Вкладочки
		 */
			thumbs: {
				use: false,
				thumb: '.thumb',
				bindAnchor: 'a',
				bindEvent: 'click',
				position: 'right',
				elHeight: 'auto',
				elWidth: 'auto',
			/* sgSlider options */
				sgSlider: false,
				sgSliderO: {},
				onSliderInit: function() {}
			}
		};
		
		var mainClass = { // - зберігаємо класи для обгортки каркасу
			container: 'sgSlideshow-container ',
			wrapper: 'sgSlideshow-wrapper ',
			itemHolder: 'sgSlideshow-itemHolder ',
			item: 'sgSlideshow-item '
		};
		var thisObj = [];
		return this.each(function(){ // Старт
			{ // Перемінні
				var o = $.extend(true, /*{},*/ p, params ); // Задіюємо налаштування
				{ // Підготовка змінних які ведуть рахунок з 1 до ведденя рахунку з 0
					o.firstSlide--;
					if( o.repeatStopSlide.constructor == Number) o.repeatStopSlide--;
					var afterClassInit = function() {};
					if( (o.stopSlide != null) && (o.stopSlide.constructor == Number) ) // якщо число
						o.stopSlide--;
						else if( (o.stopSlide != null) && (o.stopSlide.constructor == String) ) { // якщо стрічка
							afterClassInit = function() { // after all nesesarry clases will be added and $this var will be inited we lauch this function
								switch(o.stopSlide) {
									case 'last':
										o.stopSlide = $this.find('.'+mainClass.item).length;
									break;
									case 'first':
										o.stopSlide = 0;
									break;
								}
							}
						} else if( o.stopSlide != null && (o.stopSlide.constructor == Array) ) // якщо масив
							for( var k = 0; k < o.stopSlide.length; k++) o.stopSlide[k]--;
				}
			/* Змінні поточної презентації */
				var $this = $(this);
				var $items;
					// var $thumbs;
				var i = 0;
				var interval;
				var timeout;
				var animating = false;
				var quantity; // maybe $this.quatity
				var current=o.firstSlide; // maybe under $this?
			// скорочуємо назву для внутрішноьго використання
				var slideShowWidth;
				var slideShowHeight;
				var $itemsCarou; // all carousell items
				var carousell = {
					originalSize: null,
					lowSize: null,
					hightSize: null,
					preventingFast: false
				};
			// Якщо це число тоді надаємо значення як при означенні але менше на 1, оскільки рахунок в систумі є з 0, а не з 1... Інакше ітерація в масиві починаючи з 0 
			// я додав одиницю, бо інакш початкова позиція буде звісно o.firstSlide, й знову наступний слайд, згідно логіки плагіну, теж буде той самий o.firstSlide, і так буде наступний. :)
				var stopSlide = ( !isNaN( parseInt(o.stopSlide) ) && (o.stopSlide.constructor == Number) )? o.firstSlide+1:1;
				var repeatStopSlide = 0;
				var callBackOnce = false;
				
			// Мишка над піктограмками? це працює тільки тоді коли sgSlider.scrollOnHover = true
				var aboveThumbs = false;
			}
			{ // Функції
				$this._Curr = function( $obj,action){
				//	Якщо "action" тоді даний об'єкт стає із класом "cur", інакше знімаємо це клас
					if (action) {
						$obj.addClass(o.carcass.current);
					// функція відгуку зміни слайду 
						if(callBackOnce) {// Не при старті
							o.onSlideChange(current);
						}
					} else { 
						$obj.removeClass(o.carcass.current);
					}
					return this;
				}
				$this._carousellPrepare = function() {
					var $slideThis = $this.find('.'+mainClass.itemHolder);
				// "менша" та "вища" сторона, для копій з лівої/верхньої та з правої/нижної сторони
					$slideThis.prepend('<div class="lowSide"></div>').append('<div class="highSide"></div>');
				
				// також якщо опція одностороннього слайдера вімкнена то на не треба однієї із сторін
					var oneDirection = o.scroll.carousell.oneDirection;
					var count = {
						total: quantity,
						original: quantity+1,
						low: 0,
						high: 0
					};
					if(o.scroll.carousell.copy == 'full' || oneDirection) {
						if( oneDirection && o.reverse	|| !oneDirection )
							$items.clone().prependTo($slideThis.children('div.lowSide'));
						if( oneDirection && !o.reverse	|| !oneDirection )
							$items.clone().prependTo($slideThis.children('div.highSide'));
						count = {
							total: (quantity+1)*3,
							original: quantity+1,
							low: quantity+1,
							high: quantity+1
						};
					} else for(var k=0; k<o.scroll.carousell.copy; k++) {
				// це для нормальної каруселі, налаштування кіль-сті ел. в обох сторонах
						$items.eq($items.length-k-1).clone().prependTo($slideThis.children('div.lowSide'));
						$items.eq(k).clone().appendTo($slideThis.children('div.highSide'));
						if(k>$items.length) break;
						count = {
							total: (quantity+1)+o.scroll.carousell.copy*2,
							original: quantity+1,
							low: o.scroll.carousell.copy,
							high: o.scroll.carousell.copy
						};
					}

					$itemsCarou = $this.find('.'+mainClass.item);
					
				// перевизначення розмірів сторін з елементами у об'єкт каруселі
					var size = (o.scroll.vertical)?
						$items.eq(o.firstSlide).height()
						:$items.eq(o.firstSlide).width();
						
					carousell = {
						originalSize: size	*count.original,
						lowSize:	size	*count.low + o.addSizeToHolder,
						hightSize:	size	*count.high + o.addSizeToHolder
					};
				
				// перевизначення розмірів контенера з елементами
					var amount = carousell.originalSize + carousell.lowSize + carousell.hightSize + o.addSizeToHolder;
				// можливо десь й знадобиться кількість елементів усієї каруселі, але це "можливо".....
					// carouQuantity = carouQuantity-1;
					$slideThis.css((!o.scroll.vertical)?
						(!oneDirection || oneDirection && o.reverse)?
							{'left': -(slideShowWidth*(o.firstSlide) + carousell.lowSize )}
							:{'left': -slideShowWidth*(o.firstSlide)}
						:(!oneDirection || oneDirection && o.reverse)?
							{'top': -(slideShowHeight*(o.firstSlide) + carousell.lowSize )}
							:{'top': -slideShowHeight*(o.firstSlide)}
					).css((!o.scroll.vertical)?
						{'width':amount}
						:{'height':amount}
					);
				}
				$this._slideshowGo = function( ) {
				// помістили перевірку сюди, задля того щоб в майбутньому була можливість виключати та включати слайдшоу autoNext
					if (o.autoNext) {
						var firstStep = true;
						interval = setInterval(function() {
						// робимо АвтоНаступний слайд наступним
							var gotoSlide = (!o.reverse)? current+1 : current-1 ;
						// Якщо необхідно показати певну послідовність слайдів
							if( (o.stopSlide != null) && (o.stopSlide.constructor == Array) ) {
								if(firstStep) o.onSlideRepeatStarts(); // callback when repeatStopSlide starts
								firstStep = false;
								if(o.stopSlide.length >= 1) {
									gotoSlide = o.stopSlide[stopSlide++];
									if( o.stopSlide[stopSlide] == undefined) {
										stopSlide = 0;
										if( (o.repeatStopSlide === false) || (repeatStopSlide++ >= o.repeatStopSlide) ) {
											o.autoNext = false;
											clearInterval(interval);
											
											o.onSlideRepeatEnds(); // callback when repeatStopSlide ends
											firstStep = true;
											repeatStopSlide = 0;
										}
									}
								}
							}
						// Якщо необхідно пройтись від А до Я
							if( (o.stopSlide != null) && (o.stopSlide.constructor == Number) ) {
							
								if(firstStep) o.onSlideRepeatStarts(); // callback when repeatStopSlide starts
								firstStep = false;
								
								gotoSlide = stopSlide++;
								if( stopSlide > o.stopSlide ) {
									stopSlide = o.firstSlide;
									if( (o.repeatStopSlide === false) || (repeatStopSlide++ >= o.repeatStopSlide) ) {
										o.autoNext = false;
										clearInterval(interval);
										
										o.onSlideRepeatEnds(); // callback when repeatStopSlide ends
										firstStep = true;
										repeatStopSlide = 0;
									}
								}
							}
							$this._showSlide(
								{ num: gotoSlide, action: 'autoNext' }
							);
						},o.showTime);
					}
				}
				$this._showSlide = function( params ) {
					{ // Підготовка
						if( // Якщо вімкнена анімація тільки по її завершенню, і зараз все таки щось "відбувається" - йдемо до "виходу"
							animating && o.animateWhenShowEnds
							|| (carousell.preventingFast == true) && o.scroll.carousell.enable
						) return true;
						function ifLastFirst() { // функція для перевірки чи відбуваєтсья зараз перехід від першого до останнього й навпаки
							return (current == 0) && (params.num == $items.length-1) || (current == $items.length-1) && (params.num == 0);
						}
						animating = !animating; // зараз відбувається анімація
						var params = $.extend({ // типові праметри
							num: null,
							action: '',
							jump: false
						}, params || {});
					}
					{ // Анімація
					/**//* Тут ми задіюємо зміну слайдів *//**/
						params.num = (params.num < 0)?quantity:(params.num > quantity)?0:params.num;

						if(params.num != current) // якщо слайд і так вже показується, навіщо це все?, нехай затримка й інші дії будуть виконані....
						switch (o.mode) {
							case 'scroll':
								
								var $slideThis = $this.find('.sgSlideshow-itemHolder');
							
							// Величина для прокрутки щоб не задежати від розташування слайдера ( вертикально/горизонтально )
								var amount = (!o.scroll.vertical)?slideShowWidth:slideShowHeight;
							
							/** КАРУСЕЛЬ в кінці є break; **/
								if(o.scroll.carousell.enable == true) {

									var scrollValue = Math.abs(amount*params.num-amount*current);
									var afterAnimating;
									var oneDirection = o.scroll.carousell.oneDirection;
									var afterAnimation = function() {}

								// Якщ карусель повинна крутитись в одну сторону
									if( oneDirection ) {
									// анімація тільки між поточним та обраним
										if(
											(o.scroll.itemsLine == 'inline') && ifLastFirst() ||
											o.scroll.itemsLine == 'tocurrent' 
										) {
											$items.hide();
											$items.eq(current).show();
											
											if( !o.reverse && params.num>current || o.reverse && params.num<current ) {
												$items.eq(params.num).show();
											
												var zero =(o.reverse)?-(amount+carousell.lowSize):0;
												$slideThis.css((o.scroll.vertical)?
													{'top': zero}
													:{'left': zero});
												scrollValue		= (o.reverse)?-carousell.lowSize:-amount;
												afterAnimation	= function() {
													$items.show();
												}
												
											}
											else {
												if(o.reverse) {
													$slideThis.children('.lowSide').find('.sgSlideshow-item').hide();
													$slideThis.children('.lowSide').find('.sgSlideshow-item').eq(params.num).show();
													$slideThis.css((o.scroll.vertical)?
													// (o.scroll.position == 'vertical')?
														{'top': -amount}
														:{'left': -amount});
													scrollValue		= 0;
													afterAnimation = function() {
														$slideThis.children('.lowSide').find('.sgSlideshow-item').show();
														$items.show();
													}
												} else {
													$slideThis.children('.highSide').find('.sgSlideshow-item').hide();
													$slideThis.children('.highSide').find('.sgSlideshow-item').eq(params.num).show();
													$slideThis.css((o.scroll.vertical)?
														{'top': 0}
														:{'left': 0});
													scrollValue		= -amount;
													afterAnimation = function() {
														$slideThis.children('.highSide').find('.sgSlideshow-item').show();
														$items.show();
													}
												}
											}
											afterAnimating	= -(amount*params.num+carousell.lowSize);
										}
									// Повна анімація
										if(
											(o.scroll.itemsLine == 'inline') && !ifLastFirst() ||
											o.scroll.itemsLine == 'full'
										) if( !o.reverse && (params.num>current) || o.reverse && (params.num<current) ) {
											scrollValue		= ( o.reverse )?-(amount*params.num + carousell.lowSize):-amount*params.num;
											afterAnimating	= scrollValue;
										} else {
											scrollValue		= (!o.reverse )?-(amount*params.num + carousell.originalSize):-amount*params.num;
											afterAnimating	= ( o.reverse )?-(amount*params.num + carousell.lowSize):-amount*params.num;;
										}
									}
									else
								// нормальна карусель
										if( scrollValue <= carousell.originalSize*0.5 ) {
											scrollValue = -(amount*params.num + carousell.lowSize);
											afterAnimating = scrollValue;
										} else {
											if(params.num>current) {
												scrollValue = -amount*params.num;
											} else {
												scrollValue = -(carousell.lowSize + carousell.originalSize + amount*params.num) ;
											}
											afterAnimating = -(amount*params.num + carousell.lowSize);
										}
									carousell.preventingFast = true;
									setTimeout(function(){
										carousell.preventingFast = false
									},o.showTime*0.25);
									$slideThis.stop(true, true).animate(
										(o.scroll.vertical)? {'top': scrollValue} :{'left': scrollValue},
										(params.jump)? 0 :o.scroll.speed,
										o.scroll.easing,
										function(){
											afterAnimation();
											$slideThis.css((o.scroll.vertical)?
													{'top': afterAnimating}
													:{'left': afterAnimating}
											);
											o.onEndAnimation();
											animating = !animating;
										}
									);
									
									current = params.num ;
									break;
								}
							
							/** звичайни слайдер **/
								if(
									(o.scroll.itemsLine == 'inline') && ifLastFirst() ||
									o.scroll.itemsLine =='tocurrent'
								) {
									$items.hide();
									$items.eq(current).show();
									$items.eq(params.num).show();
									var goTo = 0;
									if( params.num > current ) {
										goTo = -amount;
										$slideThis.css((o.scroll.vertical)?
											{'top': 0}
											:{'left':0});
									} else
										$slideThis.css((o.scroll.vertical)?
											{'top': -amount}
											:{'left':-amount});
									$slideThis.stop(true, true).animate(
										(o.scroll.vertical)? {'top': goTo} :{'left':goTo},
										(params.jump)? 0:o.scroll.speed,
										o.scroll.easing, 
										function(){
											o.onEndAnimation();
											animating = !animating;
										}
									);
								}
								if(
									(o.scroll.itemsLine == 'inline' && !ifLastFirst()) ||
									o.scroll.itemsLine =='full'
								) {
									$items.show();
									$slideThis.stop(true, true).animate(
										(o.scroll.vertical)? {'top': -amount*params.num} :{'left': -amount*params.num},
										(params.jump)? 0:o.scroll.speed,
										o.scroll.easing,
										function(){
											o.onEndAnimation();
											animating = !animating;
										}
									);
								}
							break;
							case 'staticly': {
								$items.eq(current).stop(true, true).fadeOut(
									(params.jump)? 0:o.staticly.hideTime,
									o.staticly.easing
								);
								$items.eq(params.num).stop(true, true).fadeIn(
									(params.jump)? 0:o.staticly.showTime,
									o.staticly.easing,
									function(){
										o.onEndAnimation();
										animating = !animating;
									}
								);
							}
							break;
						}
						current = params.num ;
						
						o.onStartAnimation();
						
					// Робота із класом o.carcass.current
						callBackOnce = true;
						$this._Curr( $items.eq(current), false );
						$this._Curr( $items.eq(params.num), true );
						callBackOnce = false;
					}
					{ // Додаткові дії необхідні під час зміни слайду
						// Якщо необхідна затримка після показу і чи затримка відповідає події - то робимо затримку
						if ( o.delay.enable == true && o.delay.enableOn.search(params.action) != -1 ) { 
							clearInterval(interval);  
							clearTimeout(timeout);
							timeout = setTimeout(function() {
								$this._slideshowGo();
							},o.showTime*o.delay.multiplyTime); 
							// відбувається збільшення в "multipleDelay+1" разів затримки, 
							// "multipleDelay" тут, і ще один чекаєм від setInterval(),
							// зате коли той хто переглядає, встигне переглянути слайд перед тим як відбудеться настпуний показ
						}
						// Робота із кнопочками, а саме при зміні поточного слайду ми підсвічуємо необхідні кнопочки
						if ( o.buttons.use ) {
							$this._Curr( $pagesButtons, false );
							$this._Curr( $pagesButtons.eq(current), true );
						}
						// Так само із "піктограмами"
						if ( o.thumbs.use ) {
							$this._Curr( $thumbs, false );
							$this._Curr( $thumbs.eq(current), true );
							if ( o.thumbs.sgSlider && !aboveThumbs)	{
								$thumbsC._goTo({
									isNum: true,
									amount: current,
									action: 'sgSlidesgow'
								});
							}
						}
					}
				}
			}
			{ // Функції які розшрюють DOM об'єкт
				this._autoNext = function( bool, p ) {
					p = $.extend(true,{
						toFirst: false,
						jump: false
					},p);
					o.autoNext = bool;
					if(o.autoNext) $this._slideshowGo();
					if(p.toFirst) $this._showSlide({
						num: o.firstSlide,
						action: 'disableAuto-Next',
						jump: (p.jump)? true :false
					});
				}
			}
			{ // Підготовка елементу до роботи
				{// підключаємо при потребі jQuery.easing.js
					if ((
						(( o.staticly.easing		!='linear' ) && o.mode == 'staticly')
						|| (( o.scroll.easing		!='linear' ) && o.mode == 'scroll' )
						// || (( o.thumbs.scroll.easing	!='linear' ) && o.thumbs.scroll.use)
					) && !easingLoaded ) {
						ImportJavaScript(o.jlibs.easing)	
					}
				}
				if(o.buildHTML) { // Додатков розмітка класами
					$this.addClass(mainClass.container+o.carcass.container) // додаємо кореневий клас
					.children(o.wrapSelector).addClass(mainClass.item+o.carcass.item+' '+o.mode)
					.each(function(ind){ // опрацьовуємо кожний слайд, також надаємо їм клас
						if (o.mode == 'staticly') $(this).hide();
						$(this).addClass(o.carcass.item+'-'+ind);
					})
					.wrapAll('<div class="'+mainClass.wrapper+o.carcass.wrapper+'" >'
					+'<div class="'+mainClass.itemHolder+o.carcass.itemHolder+'" />'+'</div>');
				} else {
					$this.addClass(mainClass.container+o.carcass.container)
					.children().eq(0).addClass(mainClass.wrapper+o.carcass.wrapper)	// .children('div')
					.children().addClass(mainClass.itemHolder+o.carcass.itemHolder)	// .children('div, ul, ol')
					.children().addClass(mainClass.item+o.carcass.item+' '+o.mode)	// .children('div, li')
					.each(function(ind){
						if (o.mode == 'staticly') $(this).hide();
						$(this).addClass(o.carcass.item+'-'+ind);
					});
				}
				afterClassInit();
				if(o.scroll.vertical) $this.addClass('vertical');
				if(o.reverse) $this.addClass('reverse');
				
				$items = $this.find('.'+mainClass.item);
				slideShowWidth = $items.eq(o.firstSlide).width();
				slideShowHeight = $items.eq(o.firstSlide).height();
				
				$this.find('.'+mainClass.itemHolder+', .'+mainClass.wrapper).css({ // Встановлюємо розмір слайдшоу
					'width': slideShowWidth,
					'height': slideShowHeight
				});
				
				quantity = $items.length-1; // Кількість слайдів поинаючи з 0
			
				if (o.mode == 'scroll') { // Встановлюєм ширину контейнера ел. для можливоісті прокрутки та поч. позицію
					if ( o.scroll.vertical )
						$this.find('.sgSlideshow-itemHolder').css({
							'height': $items.eq(o.firstSlide).height()*(quantity+1)+o.addSizeToHolder,
							'width': $items.eq(o.firstSlide).width(),
							'top': -slideShowHeight*(o.firstSlide) // поч. позиція
						});
					else
						$this.find('.sgSlideshow-itemHolder').css({
							'height': $items.eq(o.firstSlide).height(),
							'width': $items.eq(o.firstSlide).width()*(quantity+1)+o.addSizeToHolder,
							'left': -slideShowWidth*(o.firstSlide) // поч. позиція
						});
				} else { // Тоді "фейд" для першого ел.
					$this._Curr( $items.eq(o.firstSlide).fadeIn(o.staticly.firstSlideShowtime), true );
					// .addClass(o.carcass.current);
				};
				if (o.buttons.use) {/** ініціалізація КНОПОЧОК, побудова і всіляке інше **/
					var bttnClass = o.buttons.bttnClass; // скорочення
				// початок обгортки кнопочок
					var str = '<div class="'+bttnClass.bttnWrap+' sgSlideshow-bttnWrapper" >';
						if ( o.buttons.prev && !bttnClass.separate )
								str += '<div class="'+bttnClass.prev+'"><a>'+bttnClass.prevText+'</a></div>';
						if ( o.buttons.pages ) for ( i=0; i<= quantity; i++ )
								str += '<a class="'+bttnClass.pages+'" slidenum="'+i+'" >'+parseInt(i+1)+'</a>';
						if ( o.buttons.next && !bttnClass.separate )
							str += '<div class="'+bttnClass.next+'"><a >'+bttnClass.nextText+'</a>';
					str += '</div>'
					$this.append(str);
					
					if ( bttnClass.separate ) {
						var navi = '';
						navi +=(o.buttons.prev)? '<div class="'+bttnClass.prev+'"><a >'+bttnClass.prevText+'</a></div>':'' ;
						navi +=(o.buttons.next)? '<div class="'+bttnClass.next+'"><a >'+bttnClass.nextText+'</a>':'' ;
						$this.append(navi);
					}
				// все... ми їх обгорнули :)
				/* Ховаєм або показуєм кнопочки */
				if(o.buttons.hideshow != 'none') {
					// створюємо клас, для пошуку йункцією .фінд()
					var onHover = '';
					switch (o.buttons.hideshow) {
						case 'pages': onHover = '.'+bttnClass.pages; break;
						case 'next': onHover = '.'+bttnClass.next; break;
						case 'prev': onHover = '.'+bttnClass.prev; break;
						case 'next&prev': onHover = '.'+bttnClass.next+', '+'.'+bttnClass.prev; break;
						default: onHover = '.'+bttnClass.next+', '+'.'+bttnClass.prev+', '+'.'+bttnClass.pages;
					}
					// ховаємо необхідні...
					$this.find(onHover).fadeOut(o.buttons.showTime);
					/** надаємо дію, також обираємо необхідний еффект */					
					// даємо події для приховування елментів
						$this.bind(o.buttons.bind.hideOn,function(){
							switch (o.buttons.bind.hideStyle) {
								case 'lightning': $(this).find(onHover).hide(); break;
								default: $(this).find(onHover).stop(true, true).fadeOut(o.buttons.hideTime);
							}
						})
					// даємо події для показу елементів
						.bind(o.buttons.bind.showOn,function(){
							switch (o.buttons.bind.showStyle) {
								case 'lightning': $(this).find(onHover).show(); break;
								default: $(this).find(onHover).stop(true, true).fadeIn(o.buttons.showTime);
							}
						});
				}
				/* Кінець - Ховаєм або показуєм кнопочки */
				
					var $pagesButtons = $this.find('a.'+bttnClass.pages);
					$this._Curr( $pagesButtons.eq(o.firstSlide), true );
					
					if (o.buttons.prev) $this.find('div.'+bttnClass.prev+' a').bind(o.buttons.actionOn,function() {
							$this._showSlide({
								num: current-1,
								action: 'showprev'
							});
					});
					if (o.buttons.pages) for ( i=0; i<= quantity; i++ ) $pagesButtons.eq(i).bind(o.buttons.actionOn,function() {
								$this._showSlide({
									num: parseInt($(this).attr('slidenum')),
									action: 'exactslide'
								});
							});
					if (o.buttons.next) $this.find('div.'+bttnClass.next+' a').bind(o.buttons.actionOn,function() {
							$this._showSlide({
								num: current+1,
								action: 'shownext'
							});
					});
					/** завершили з подіями... */
				}/** ... та й з кнопочками */
				
				if(o.thumbs.use){ /** Робота над боковим контейнером **/
				// Створємо каркас для піктограм
					var thumbsClasses = {
						container: 'sgSlideshow-thumbContiner',
						wrapper: 'sgSlideshow-thumbWrapper',
						itemHolder: 'sgSlideshow-thumbHolder',
						item: 'sgSlideshow-thumbItem'
					};
					var thumbs = '';
					$items.each(function(id){
						thumbs += '<div class="'+thumbsClasses.item+' thumb-'+id+'">'+$(this).find(o.thumbs.thumb).removeObjReturnHTML()+'</div>';
					});
					$this.append(
					'<div class="'+thumbsClasses.container+' '+o.thumbs.position+'">'
						+'<div class="'+thumbsClasses.wrapper+'">'
							+'<div class="'+thumbsClasses.itemHolder+'">'
								+thumbs
							+'</div>'
						+'</div>'
					+'</div>');
				// Працбжмо з кожною піктограмою а саме...
					var $thumbs = $this.find('.'+thumbsClasses.item).each(function(id){
						$(this)
						.css({ // .. надаємо ширину та висоту, зазвичай в обох 'auto'
							height: o.thumbs.elHeight,
							width: o.thumbs.elWidth
						})
						.find(o.thumbs.bindAnchor) // .. Пошук обєку який буде перемикачем до слайду
						.bind(o.thumbs.bindEvent,function(e){ // .. Прив'язуємо подію
							e.preventDefault();
							$this._Curr( $thumbs, false );
							$this._Curr( $(this).parents('.'+thumbsClasses.item), true );
							$this._showSlide({
								num: parseInt(id),
								action: 'exactslide'
							});
							return false;
						})
					});
					// $thumbs.eq(o.firstSlide).addClass(o.carcass.current); // Робимо поточний слайд
					$this._Curr( $thumbs.eq(o.firstSlide), true );
					var thumbsCCSS; switch(o.thumbs.position) { // Для правильної позиції контейнера піктограм
						case 'left':
							thumbsCCSS = {
								left: - $thumbs.eq(o.firstSlide).width()
							};
						break;
						case 'top':
							thumbsCCSS = {
								top: - $thumbs.eq(o.firstSlide).height()
							};
						break;
						case 'bottom':
							thumbsCCSS = {
								bottom: - $thumbs.eq(o.firstSlide).height()
							};
						break;
						default:
							thumbsCCSS = {
								right: - $thumbs.eq(o.firstSlide).width()
							};
					}
					var $thumbsC = $this.find('.'+thumbsClasses.container).css(thumbsCCSS); // Надаємо конейнеру стилі

					$this.css({overflow: 'visible'}); // Якщо є піктограми, то слайдшоу у будькому випадку не матиме обмежень
					
					if(o.thumbs.sgSlider) {// Робимо піктограми із прокруткою!!!
						var sgSliderO = $.extend({
							vertical: (o.thumbs.position != 'top' && o.thumbs.position != 'bottom')?true:false,
							navigation: {
								use: false
							},
							scrollOnHover: {
								enable: true,
								returnToCurrent: false
						}}, o.thumbs.sgSliderO || {});
						$thumbsC.css({
							height: (o.thumbs.position != 'top' && o.thumbs.position != 'bottom')?'100%':'auto',
							position: 'absolute'
						});
						$thumbsC = $thumbsC.sgSlider( sgSliderO );
						if(sgSliderO.scrollOnHover.enable) {
							$thumbsC.bind({
								mouseenter: function() {
									aboveThumbs = true;
								},
								mouseleave: function() {
									aboveThumbs = false;
								}
							});
						}
						o.thumbs.onSliderInit();
					}
				}
				
				if (o.scroll.carousell.enable == true) $this._carousellPrepare(); // Робимо зміни якщо карусель
			}
			{ // Тут ми робимо старт!!!
				$this._slideshowGo();
				o.onStart();
			}
		});
	};
})(jQuery);
