(function ($) {

	// ------- 处理搜索侧边栏 -----------

	var searchForm = $('#search-form');
	var searchSubmit = searchForm.find('.btn-gal')
	searchSubmit.each(function () {
		$(this).on('click', function (event) {
			var searchInput = $(this).prev()
			var input = searchInput.val().trim()
			if(input === null || input === '') {
				event.preventDefault();
				searchInput.focus()
			}
		})
	})
	
	// ------- 处理搜索侧边栏结束 --------

	var slideList = []
	var prefix = window.slideConfig.prefix
	var ext = '.' + window.slideConfig.ext
	var maxCount = window.slideConfig.maxCount
	for(var k = 0; k < 6; k++) {
		var n = Math.floor(Math.random() * maxCount) + 1
		while(slideList.indexOf(n) !== -1) {
			n = Math.floor(Math.random() * maxCount) + 1
		}
		slideList.push(n)
	}

	// ------- 处理背景图 --------------

	var cdSlideShow = $('.cb-slideshow')
	cdSlideShow.find('span').each(function (i, span) {
		$(this).css('backgroundImage', 'url(\'' + prefix + slideList[i] + ext + '\')')
	})

	// ------- 处理背景图结束 -----------

	var panelToggle = $('.panel-toggle')
	var panelRemove = $('.panel-remove')
	panelToggle.on('click', function () {
		var that = $(this)
		var panelGal = that.parents('.panel-gal')
		if(that.hasClass('fa-chevron-circle-up')) {
			that.removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down')
			panelGal.addClass('toggled')
		} else {
			that.removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up')
			panelGal.removeClass('toggled')
		}
	})
	panelRemove.on('click', function () {
		var that = $(this)
		// TODO 不用jqueryUI
		that.parents('.panel').animate({
			opacity: 0
		}, 1000, function () {
			$(this).css('display', 'none')
			// $(this).css('opacity', 1)
		})
	})

	var tagsTab = $('#tags-tab')
	var friendLinksTab = $('#friend-links-tab')
	var linksTab = $('#links-tab')

	if (tagsTab) {
		tagsTab.tab('show')
	} else if (friendLinksTab) {
		friendLinksTab.tab('show')
	} else if (linksTab) {
		linksTab.tab('show')
	}


	if (tagsTab) {
		tagsTab.on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		})
	}

	if (friendLinksTab) {
		friendLinksTab.on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		})
	}

	if (linksTab) {
		linksTab.on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		})
	}

	// ------- 处理返回顶端 -------------

	var goTop = $('#gal-gotop')
	goTop.css('bottom', '-40px')
	goTop.css('display', 'block')
	$(window).on('scroll', function () {
		if($(this).scrollTop() > 200) {
			goTop.css('bottom', '20px')
		} else {
			goTop.css('bottom', '-40px')
		}
	})
	goTop.on('click', function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800)
	})

	// ------- 处理返回顶端结束 ----------

	// ------- 代码块: 语言标签 + 一键复制 ----

	$('figure.highlight').each(function () {
		var fig = $(this)
		var lang = fig.attr('class').replace('highlight', '').trim() || 'text'
		// 头部要留在原地, 所以把横向滚动挪进内层容器
		fig.children('table').wrap('<div class="code-scroll"></div>')
		fig.prepend('<div class="code-header"><span class="code-lang">' + lang + '</span>' +
			'<button type="button" class="code-copy">复制</button></div>')
	})

	$(document).on('click', '.code-copy', function () {
		var btn = $(this)
		var code = btn.closest('figure').find('td.code .line').map(function () {
			return $(this).text()
		}).get().join('\n')
		function flash(text, ok) {
			btn.text(text)
			if (ok) { btn.addClass('copied') }
			setTimeout(function () { btn.text('复制').removeClass('copied') }, 1500)
		}
		// clipboard 只在 https / localhost 下可用
		if (!navigator.clipboard) { return flash('请手动复制', false) }
		navigator.clipboard.writeText(code).then(function () { flash('已复制', true) }, function () { flash('复制失败', false) })
	})

	// ------- 代码块处理结束 ----------------

	// ------- 博客宠物 doro ------------------

	// 关掉只记 sessionStorage: 本次浏览不再打扰, 下次访问自己回来, 就不用再做一个召唤按钮
	if (window.doroImg && !sessionStorage.getItem('doro-hidden')) {
		var doroLines = [
			'doro~',
			'又在看什么高深的东西呀',
			'这篇公式好多, 头晕晕的',
			'摸鱼一下也没关系的啦',
			'点我干嘛, 我又不会写代码',
			'记得点右上角的复制按钮哦',
			'咕噜咕噜...',
			'今天也要加油鸭'
		]

		var h = new Date().getHours()
		var greet = h < 6 ? '这么晚还不睡?' :
			h < 11 ? '早上好呀' :
			h < 14 ? '中午啦, 该吃饭了' :
			h < 18 ? '下午好' :
			h < 23 ? '晚上好' : '夜深了, 早点休息'

		// 先挂静态贴纸: 秒出, 且 WebGL 不可用/脚本加载失败时就是最终形态
		var pet = $(
			'<div id="doro-pet">' +
			'<div class="doro-bubble"></div>' +
			'<img class="doro-body" src="' + window.doroImg + '" alt="doro" draggable="false">' +
			'<button type="button" class="doro-close" title="今天不想看到 doro">&times;</button>' +
			'</div>'
		).appendTo('body')

		var bubble = pet.find('.doro-bubble')
		var bubbleTimer
		var doroModel = null

		function doroSay(text) {
			bubble.text(text).addClass('show')
			clearTimeout(bubbleTimer)
			bubbleTimer = setTimeout(function () { bubble.removeClass('show') }, 4000)
		}

		setTimeout(function () { doroSay(greet) }, 1200)

		// 事件委托: 贴纸换成 canvas 之后依然生效
		pet.on('click', '.doro-body, .doro-hit', function () {
			doroSay(doroLines[Math.floor(Math.random() * doroLines.length)])
			if (doroModel) { doroModel.expression() }
		})

		pet.find('.doro-close').on('click', function () {
			sessionStorage.setItem('doro-hidden', '1')
			pet.remove()
		})

		// ---- Live2D: 懒加载 ~790KB 运行时, 成功才把贴纸换成模型 ----
		// 宽度不够时 CSS 已经把 #doro-pet 隐藏了, 没必要再去下运行时
		if (window.doroLive2D && matchMedia('(min-width: 901px)').matches) {
			window.doroLive2D.js.reduce(function (chain, src) {
				return chain.then(function () { return $.getScript(src) })
			}, $.Deferred().resolve().promise())
				.then(function () {
					var canvas = $('<canvas class="doro-canvas"></canvas>').insertAfter(bubble)[0]
					$('<div class="doro-hit"></div>').insertAfter(canvas)
					var app = new PIXI.Application({
						view: canvas,
						width: 200,
						height: 230,
						backgroundAlpha: 0,
						resolution: window.devicePixelRatio || 1,
						autoDensity: true
					})
					return PIXI.live2d.Live2DModel.from(window.doroLive2D.model).then(function (model) {
						model.anchor.set(0.5, 0.5)
						model.position.set(app.view.width / 2 / app.renderer.resolution, app.view.height / 2 / app.renderer.resolution)
						model.scale.set(Math.min(200 / model.width, 230 / model.height))
						app.stage.addChild(model)
						doroModel = model
						pet.find('.doro-body').remove()

						// 视线跟着鼠标走: focus 要的是 canvas 内坐标
						$(document).on('mousemove.doro', function (e) {
							var r = canvas.getBoundingClientRect()
							model.focus(e.clientX - r.left, e.clientY - r.top)
						})
					})
				})
				.catch(function (err) {
					// 保持静态贴纸, 不打扰访客
					if (window.console) { console.warn('doro live2d 加载失败, 回退静态贴纸:', err) }
				})
		}
	}

	// ------- 博客宠物结束 -------------------


	
})($)

