(function() {
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region node_modules/@mozilla/readability/Readability.js
	var require_Readability = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		/**
		* Public constructor.
		* @param {HTMLDocument} doc     The document to parse.
		* @param {Object}       options The options object.
		*/
		function Readability(doc, options) {
			if (options && options.documentElement) {
				doc = options;
				options = arguments[2];
			} else if (!doc || !doc.documentElement) throw new Error("First argument to Readability constructor should be a document object.");
			options = options || {};
			this._doc = doc;
			this._docJSDOMParser = this._doc.firstChild.__JSDOMParser__;
			this._articleTitle = null;
			this._articleByline = null;
			this._articleDir = null;
			this._articleSiteName = null;
			this._attempts = [];
			this._metadata = {};
			this._debug = !!options.debug;
			this._maxElemsToParse = options.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE;
			this._nbTopCandidates = options.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES;
			this._charThreshold = options.charThreshold || this.DEFAULT_CHAR_THRESHOLD;
			this._classesToPreserve = this.CLASSES_TO_PRESERVE.concat(options.classesToPreserve || []);
			this._keepClasses = !!options.keepClasses;
			this._serializer = options.serializer || function(el) {
				return el.innerHTML;
			};
			this._disableJSONLD = !!options.disableJSONLD;
			this._allowedVideoRegex = options.allowedVideoRegex || this.REGEXPS.videos;
			this._linkDensityModifier = options.linkDensityModifier || 0;
			this._flags = this.FLAG_STRIP_UNLIKELYS | this.FLAG_WEIGHT_CLASSES | this.FLAG_CLEAN_CONDITIONALLY;
			if (this._debug) {
				let logNode = function(node) {
					if (node.nodeType == node.TEXT_NODE) return `${node.nodeName} ("${node.textContent}")`;
					let attrPairs = Array.from(node.attributes || [], function(attr) {
						return `${attr.name}="${attr.value}"`;
					}).join(" ");
					return `<${node.localName} ${attrPairs}>`;
				};
				this.log = function() {
					if (typeof console !== "undefined") {
						let args = Array.from(arguments, (arg) => {
							if (arg && arg.nodeType == this.ELEMENT_NODE) return logNode(arg);
							return arg;
						});
						args.unshift("Reader: (Readability)");
						console.log(...args);
					} else if (typeof dump !== "undefined") {
						var msg = Array.prototype.map.call(arguments, function(x) {
							return x && x.nodeName ? logNode(x) : x;
						}).join(" ");
						dump("Reader: (Readability) " + msg + "\n");
					}
				};
			} else this.log = function() {};
		}
		Readability.prototype = {
			FLAG_STRIP_UNLIKELYS: 1,
			FLAG_WEIGHT_CLASSES: 2,
			FLAG_CLEAN_CONDITIONALLY: 4,
			ELEMENT_NODE: 1,
			TEXT_NODE: 3,
			DEFAULT_MAX_ELEMS_TO_PARSE: 0,
			DEFAULT_N_TOP_CANDIDATES: 5,
			DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),
			DEFAULT_CHAR_THRESHOLD: 500,
			REGEXPS: {
				unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
				okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,
				positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,
				negative: /-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|footer|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|widget/i,
				extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
				byline: /byline|author|dateline|writtenby|p-author/i,
				replaceFonts: /<(\/?)font[^>]*>/gi,
				normalize: /\s{2,}/g,
				videos: /\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i,
				shareElements: /(\b|_)(share|sharedaddy)(\b|_)/i,
				nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,
				prevLink: /(prev|earl|old|new|<|«)/i,
				tokenize: /\W+/g,
				whitespace: /^\s*$/,
				hasContent: /\S$/,
				hashUrl: /^#.+/,
				srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
				b64DataUrl: /^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i,
				commas: /\u002C|\u060C|\uFE50|\uFE10|\uFE11|\u2E41|\u2E34|\u2E32|\uFF0C/g,
				jsonLdArticleTypes: /^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/,
				adWords: /^(ad(vertising|vertisement)?|pub(licité)?|werb(ung)?|广告|Реклама|Anuncio)$/iu,
				loadingWords: /^((loading|正在加载|Загрузка|chargement|cargando)(…|\.\.\.)?)$/iu
			},
			UNLIKELY_ROLES: [
				"menu",
				"menubar",
				"complementary",
				"navigation",
				"alert",
				"alertdialog",
				"dialog"
			],
			DIV_TO_P_ELEMS: /* @__PURE__ */ new Set([
				"BLOCKQUOTE",
				"DL",
				"DIV",
				"IMG",
				"OL",
				"P",
				"PRE",
				"TABLE",
				"UL"
			]),
			ALTER_TO_DIV_EXCEPTIONS: [
				"DIV",
				"ARTICLE",
				"SECTION",
				"P",
				"OL",
				"UL"
			],
			PRESENTATIONAL_ATTRIBUTES: [
				"align",
				"background",
				"bgcolor",
				"border",
				"cellpadding",
				"cellspacing",
				"frame",
				"hspace",
				"rules",
				"style",
				"valign",
				"vspace"
			],
			DEPRECATED_SIZE_ATTRIBUTE_ELEMS: [
				"TABLE",
				"TH",
				"TD",
				"HR",
				"PRE"
			],
			PHRASING_ELEMS: [
				"ABBR",
				"AUDIO",
				"B",
				"BDO",
				"BR",
				"BUTTON",
				"CITE",
				"CODE",
				"DATA",
				"DATALIST",
				"DFN",
				"EM",
				"EMBED",
				"I",
				"IMG",
				"INPUT",
				"KBD",
				"LABEL",
				"MARK",
				"MATH",
				"METER",
				"NOSCRIPT",
				"OBJECT",
				"OUTPUT",
				"PROGRESS",
				"Q",
				"RUBY",
				"SAMP",
				"SCRIPT",
				"SELECT",
				"SMALL",
				"SPAN",
				"STRONG",
				"SUB",
				"SUP",
				"TEXTAREA",
				"TIME",
				"VAR",
				"WBR"
			],
			CLASSES_TO_PRESERVE: ["page"],
			HTML_ESCAPE_MAP: {
				lt: "<",
				gt: ">",
				amp: "&",
				quot: "\"",
				apos: "'"
			},
			/**
			* Run any post-process modifications to article content as necessary.
			*
			* @param Element
			* @return void
			**/
			_postProcessContent(articleContent) {
				this._fixRelativeUris(articleContent);
				this._simplifyNestedElements(articleContent);
				if (!this._keepClasses) this._cleanClasses(articleContent);
			},
			/**
			* Iterates over a NodeList, calls `filterFn` for each node and removes node
			* if function returned `true`.
			*
			* If function is not passed, removes all the nodes in node list.
			*
			* @param NodeList nodeList The nodes to operate on
			* @param Function filterFn the function to use as a filter
			* @return void
			*/
			_removeNodes(nodeList, filterFn) {
				if (this._docJSDOMParser && nodeList._isLiveNodeList) throw new Error("Do not pass live node lists to _removeNodes");
				for (var i = nodeList.length - 1; i >= 0; i--) {
					var node = nodeList[i];
					var parentNode = node.parentNode;
					if (parentNode) {
						if (!filterFn || filterFn.call(this, node, i, nodeList)) parentNode.removeChild(node);
					}
				}
			},
			/**
			* Iterates over a NodeList, and calls _setNodeTag for each node.
			*
			* @param NodeList nodeList The nodes to operate on
			* @param String newTagName the new tag name to use
			* @return void
			*/
			_replaceNodeTags(nodeList, newTagName) {
				if (this._docJSDOMParser && nodeList._isLiveNodeList) throw new Error("Do not pass live node lists to _replaceNodeTags");
				for (const node of nodeList) this._setNodeTag(node, newTagName);
			},
			/**
			* Iterate over a NodeList, which doesn't natively fully implement the Array
			* interface.
			*
			* For convenience, the current object context is applied to the provided
			* iterate function.
			*
			* @param  NodeList nodeList The NodeList.
			* @param  Function fn       The iterate function.
			* @return void
			*/
			_forEachNode(nodeList, fn) {
				Array.prototype.forEach.call(nodeList, fn, this);
			},
			/**
			* Iterate over a NodeList, and return the first node that passes
			* the supplied test function
			*
			* For convenience, the current object context is applied to the provided
			* test function.
			*
			* @param  NodeList nodeList The NodeList.
			* @param  Function fn       The test function.
			* @return void
			*/
			_findNode(nodeList, fn) {
				return Array.prototype.find.call(nodeList, fn, this);
			},
			/**
			* Iterate over a NodeList, return true if any of the provided iterate
			* function calls returns true, false otherwise.
			*
			* For convenience, the current object context is applied to the
			* provided iterate function.
			*
			* @param  NodeList nodeList The NodeList.
			* @param  Function fn       The iterate function.
			* @return Boolean
			*/
			_someNode(nodeList, fn) {
				return Array.prototype.some.call(nodeList, fn, this);
			},
			/**
			* Iterate over a NodeList, return true if all of the provided iterate
			* function calls return true, false otherwise.
			*
			* For convenience, the current object context is applied to the
			* provided iterate function.
			*
			* @param  NodeList nodeList The NodeList.
			* @param  Function fn       The iterate function.
			* @return Boolean
			*/
			_everyNode(nodeList, fn) {
				return Array.prototype.every.call(nodeList, fn, this);
			},
			_getAllNodesWithTag(node, tagNames) {
				if (node.querySelectorAll) return node.querySelectorAll(tagNames.join(","));
				return [].concat.apply([], tagNames.map(function(tag) {
					var collection = node.getElementsByTagName(tag);
					return Array.isArray(collection) ? collection : Array.from(collection);
				}));
			},
			/**
			* Removes the class="" attribute from every element in the given
			* subtree, except those that match CLASSES_TO_PRESERVE and
			* the classesToPreserve array from the options object.
			*
			* @param Element
			* @return void
			*/
			_cleanClasses(node) {
				var classesToPreserve = this._classesToPreserve;
				var className = (node.getAttribute("class") || "").split(/\s+/).filter((cls) => classesToPreserve.includes(cls)).join(" ");
				if (className) node.setAttribute("class", className);
				else node.removeAttribute("class");
				for (node = node.firstElementChild; node; node = node.nextElementSibling) this._cleanClasses(node);
			},
			/**
			* Tests whether a string is a URL or not.
			*
			* @param {string} str The string to test
			* @return {boolean} true if str is a URL, false if not
			*/
			_isUrl(str) {
				try {
					new URL(str);
					return true;
				} catch {
					return false;
				}
			},
			/**
			* Converts each <a> and <img> uri in the given element to an absolute URI,
			* ignoring #ref URIs.
			*
			* @param Element
			* @return void
			*/
			_fixRelativeUris(articleContent) {
				var baseURI = this._doc.baseURI;
				var documentURI = this._doc.documentURI;
				function toAbsoluteURI(uri) {
					if (baseURI == documentURI && uri.charAt(0) == "#") return uri;
					try {
						return new URL(uri, baseURI).href;
					} catch (ex) {}
					return uri;
				}
				var links = this._getAllNodesWithTag(articleContent, ["a"]);
				this._forEachNode(links, function(link) {
					var href = link.getAttribute("href");
					if (href) {
						if (href.indexOf("javascript:") === 0) {
							if (link.childNodes.length === 1 && link.childNodes[0].nodeType === this.TEXT_NODE) {
								var text = this._doc.createTextNode(link.textContent);
								link.parentNode.replaceChild(text, link);
							} else {
								var container = this._doc.createElement("span");
								while (link.firstChild) container.appendChild(link.firstChild);
								link.parentNode.replaceChild(container, link);
							}
						} else link.setAttribute("href", toAbsoluteURI(href));
					}
				});
				var medias = this._getAllNodesWithTag(articleContent, [
					"img",
					"picture",
					"figure",
					"video",
					"audio",
					"source"
				]);
				this._forEachNode(medias, function(media) {
					var src = media.getAttribute("src");
					var poster = media.getAttribute("poster");
					var srcset = media.getAttribute("srcset");
					if (src) media.setAttribute("src", toAbsoluteURI(src));
					if (poster) media.setAttribute("poster", toAbsoluteURI(poster));
					if (srcset) {
						var newSrcset = srcset.replace(this.REGEXPS.srcsetUrl, function(_, p1, p2, p3) {
							return toAbsoluteURI(p1) + (p2 || "") + p3;
						});
						media.setAttribute("srcset", newSrcset);
					}
				});
			},
			_simplifyNestedElements(articleContent) {
				var node = articleContent;
				while (node) {
					if (node.parentNode && ["DIV", "SECTION"].includes(node.tagName) && !(node.id && node.id.startsWith("readability"))) {
						if (this._isElementWithoutContent(node)) {
							node = this._removeAndGetNext(node);
							continue;
						} else if (this._hasSingleTagInsideElement(node, "DIV") || this._hasSingleTagInsideElement(node, "SECTION")) {
							var child = node.children[0];
							for (var i = 0; i < node.attributes.length; i++) child.setAttributeNode(node.attributes[i].cloneNode());
							node.parentNode.replaceChild(child, node);
							node = child;
							continue;
						}
					}
					node = this._getNextNode(node);
				}
			},
			/**
			* Get the article title as an H1.
			*
			* @return string
			**/
			_getArticleTitle() {
				var doc = this._doc;
				var curTitle = "";
				var origTitle = "";
				try {
					curTitle = origTitle = doc.title.trim();
					if (typeof curTitle !== "string") curTitle = origTitle = this._getInnerText(doc.getElementsByTagName("title")[0]);
				} catch (e) {}
				var titleHadHierarchicalSeparators = false;
				function wordCount(str) {
					return str.split(/\s+/).length;
				}
				if (/ [\|\-\\\/>»] /.test(curTitle)) {
					titleHadHierarchicalSeparators = / [\\\/>»] /.test(curTitle);
					let allSeparators = Array.from(origTitle.matchAll(/ [\|\-\\\/>»] /gi));
					curTitle = origTitle.substring(0, allSeparators.pop().index);
					if (wordCount(curTitle) < 3) curTitle = origTitle.replace(/^[^\|\-\\\/>»]*[\|\-\\\/>»]/gi, "");
				} else if (curTitle.includes(": ")) {
					var headings = this._getAllNodesWithTag(doc, ["h1", "h2"]);
					var trimmedTitle = curTitle.trim();
					if (!this._someNode(headings, function(heading) {
						return heading.textContent.trim() === trimmedTitle;
					})) {
						curTitle = origTitle.substring(origTitle.lastIndexOf(":") + 1);
						if (wordCount(curTitle) < 3) curTitle = origTitle.substring(origTitle.indexOf(":") + 1);
						else if (wordCount(origTitle.substr(0, origTitle.indexOf(":"))) > 5) curTitle = origTitle;
					}
				} else if (curTitle.length > 150 || curTitle.length < 15) {
					var hOnes = doc.getElementsByTagName("h1");
					if (hOnes.length === 1) curTitle = this._getInnerText(hOnes[0]);
				}
				curTitle = curTitle.trim().replace(this.REGEXPS.normalize, " ");
				var curTitleWordCount = wordCount(curTitle);
				if (curTitleWordCount <= 4 && (!titleHadHierarchicalSeparators || curTitleWordCount != wordCount(origTitle.replace(/[\|\-\\\/>»]+/g, "")) - 1)) curTitle = origTitle;
				return curTitle;
			},
			/**
			* Prepare the HTML document for readability to scrape it.
			* This includes things like stripping javascript, CSS, and handling terrible markup.
			*
			* @return void
			**/
			_prepDocument() {
				var doc = this._doc;
				this._removeNodes(this._getAllNodesWithTag(doc, ["style"]));
				if (doc.body) this._replaceBrs(doc.body);
				this._replaceNodeTags(this._getAllNodesWithTag(doc, ["font"]), "SPAN");
			},
			/**
			* Finds the next node, starting from the given node, and ignoring
			* whitespace in between. If the given node is an element, the same node is
			* returned.
			*/
			_nextNode(node) {
				var next = node;
				while (next && next.nodeType != this.ELEMENT_NODE && this.REGEXPS.whitespace.test(next.textContent)) next = next.nextSibling;
				return next;
			},
			/**
			* Replaces 2 or more successive <br> elements with a single <p>.
			* Whitespace between <br> elements are ignored. For example:
			*   <div>foo<br>bar<br> <br><br>abc</div>
			* will become:
			*   <div>foo<br>bar<p>abc</p></div>
			*/
			_replaceBrs(elem) {
				this._forEachNode(this._getAllNodesWithTag(elem, ["br"]), function(br) {
					var next = br.nextSibling;
					var replaced = false;
					while ((next = this._nextNode(next)) && next.tagName == "BR") {
						replaced = true;
						var brSibling = next.nextSibling;
						next.remove();
						next = brSibling;
					}
					if (replaced) {
						var p = this._doc.createElement("p");
						br.parentNode.replaceChild(p, br);
						next = p.nextSibling;
						while (next) {
							if (next.tagName == "BR") {
								var nextElem = this._nextNode(next.nextSibling);
								if (nextElem && nextElem.tagName == "BR") break;
							}
							if (!this._isPhrasingContent(next)) break;
							var sibling = next.nextSibling;
							p.appendChild(next);
							next = sibling;
						}
						while (p.lastChild && this._isWhitespace(p.lastChild)) p.lastChild.remove();
						if (p.parentNode.tagName === "P") this._setNodeTag(p.parentNode, "DIV");
					}
				});
			},
			_setNodeTag(node, tag) {
				this.log("_setNodeTag", node, tag);
				if (this._docJSDOMParser) {
					node.localName = tag.toLowerCase();
					node.tagName = tag.toUpperCase();
					return node;
				}
				var replacement = node.ownerDocument.createElement(tag);
				while (node.firstChild) replacement.appendChild(node.firstChild);
				node.parentNode.replaceChild(replacement, node);
				if (node.readability) replacement.readability = node.readability;
				for (var i = 0; i < node.attributes.length; i++) replacement.setAttributeNode(node.attributes[i].cloneNode());
				return replacement;
			},
			/**
			* Prepare the article node for display. Clean out any inline styles,
			* iframes, forms, strip extraneous <p> tags, etc.
			*
			* @param Element
			* @return void
			**/
			_prepArticle(articleContent) {
				this._cleanStyles(articleContent);
				this._markDataTables(articleContent);
				this._fixLazyImages(articleContent);
				this._cleanConditionally(articleContent, "form");
				this._cleanConditionally(articleContent, "fieldset");
				this._clean(articleContent, "object");
				this._clean(articleContent, "embed");
				this._clean(articleContent, "footer");
				this._clean(articleContent, "link");
				this._clean(articleContent, "aside");
				var shareElementThreshold = this.DEFAULT_CHAR_THRESHOLD;
				this._forEachNode(articleContent.children, function(topCandidate) {
					this._cleanMatchedNodes(topCandidate, function(node, matchString) {
						return this.REGEXPS.shareElements.test(matchString) && node.textContent.length < shareElementThreshold;
					});
				});
				this._clean(articleContent, "iframe");
				this._clean(articleContent, "input");
				this._clean(articleContent, "textarea");
				this._clean(articleContent, "select");
				this._clean(articleContent, "button");
				this._cleanHeaders(articleContent);
				this._cleanConditionally(articleContent, "table");
				this._cleanConditionally(articleContent, "ul");
				this._cleanConditionally(articleContent, "div");
				this._replaceNodeTags(this._getAllNodesWithTag(articleContent, ["h1"]), "h2");
				this._removeNodes(this._getAllNodesWithTag(articleContent, ["p"]), function(paragraph) {
					return this._getAllNodesWithTag(paragraph, [
						"img",
						"embed",
						"object",
						"iframe"
					]).length === 0 && !this._getInnerText(paragraph, false);
				});
				this._forEachNode(this._getAllNodesWithTag(articleContent, ["br"]), function(br) {
					var next = this._nextNode(br.nextSibling);
					if (next && next.tagName == "P") br.remove();
				});
				this._forEachNode(this._getAllNodesWithTag(articleContent, ["table"]), function(table) {
					var tbody = this._hasSingleTagInsideElement(table, "TBODY") ? table.firstElementChild : table;
					if (this._hasSingleTagInsideElement(tbody, "TR")) {
						var row = tbody.firstElementChild;
						if (this._hasSingleTagInsideElement(row, "TD")) {
							var cell = row.firstElementChild;
							cell = this._setNodeTag(cell, this._everyNode(cell.childNodes, this._isPhrasingContent) ? "P" : "DIV");
							table.parentNode.replaceChild(cell, table);
						}
					}
				});
			},
			/**
			* Initialize a node with the readability object. Also checks the
			* className/id for special names to add to its score.
			*
			* @param Element
			* @return void
			**/
			_initializeNode(node) {
				node.readability = { contentScore: 0 };
				switch (node.tagName) {
					case "DIV":
						node.readability.contentScore += 5;
						break;
					case "PRE":
					case "TD":
					case "BLOCKQUOTE":
						node.readability.contentScore += 3;
						break;
					case "ADDRESS":
					case "OL":
					case "UL":
					case "DL":
					case "DD":
					case "DT":
					case "LI":
					case "FORM":
						node.readability.contentScore -= 3;
						break;
					case "H1":
					case "H2":
					case "H3":
					case "H4":
					case "H5":
					case "H6":
					case "TH": node.readability.contentScore -= 5;
				}
				node.readability.contentScore += this._getClassWeight(node);
			},
			_removeAndGetNext(node) {
				var nextNode = this._getNextNode(node, true);
				node.remove();
				return nextNode;
			},
			/**
			* Traverse the DOM from node to node, starting at the node passed in.
			* Pass true for the second parameter to indicate this node itself
			* (and its kids) are going away, and we want the next node over.
			*
			* Calling this in a loop will traverse the DOM depth-first.
			*
			* @param {Element} node
			* @param {boolean} ignoreSelfAndKids
			* @return {Element}
			*/
			_getNextNode(node, ignoreSelfAndKids) {
				if (!ignoreSelfAndKids && node.firstElementChild) return node.firstElementChild;
				if (node.nextElementSibling) return node.nextElementSibling;
				do
					node = node.parentNode;
				while (node && !node.nextElementSibling);
				return node && node.nextElementSibling;
			},
			_textSimilarity(textA, textB) {
				var tokensA = textA.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
				var tokensB = textB.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
				if (!tokensA.length || !tokensB.length) return 0;
				return 1 - tokensB.filter((token) => !tokensA.includes(token)).join(" ").length / tokensB.join(" ").length;
			},
			/**
			* Checks whether an element node contains a valid byline
			*
			* @param node {Element}
			* @param matchString {string}
			* @return boolean
			*/
			_isValidByline(node, matchString) {
				var rel = node.getAttribute("rel");
				var itemprop = node.getAttribute("itemprop");
				var bylineLength = node.textContent.trim().length;
				return (rel === "author" || itemprop && itemprop.includes("author") || this.REGEXPS.byline.test(matchString)) && !!bylineLength && bylineLength < 100;
			},
			_getNodeAncestors(node, maxDepth) {
				maxDepth = maxDepth || 0;
				var i = 0, ancestors = [];
				while (node.parentNode) {
					ancestors.push(node.parentNode);
					if (maxDepth && ++i === maxDepth) break;
					node = node.parentNode;
				}
				return ancestors;
			},
			/***
			* grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is
			*         most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
			*
			* @param page a document to run upon. Needs to be a full document, complete with body.
			* @return Element
			**/
			_grabArticle(page) {
				this.log("**** grabArticle ****");
				var doc = this._doc;
				var isPaging = page !== null;
				page = page ? page : this._doc.body;
				if (!page) {
					this.log("No body found in document. Abort.");
					return null;
				}
				var pageCacheHtml = page.innerHTML;
				while (true) {
					this.log("Starting grabArticle loop");
					var stripUnlikelyCandidates = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS);
					var elementsToScore = [];
					var node = this._doc.documentElement;
					let shouldRemoveTitleHeader = true;
					while (node) {
						if (node.tagName === "HTML") this._articleLang = node.getAttribute("lang");
						var matchString = node.className + " " + node.id;
						if (!this._isProbablyVisible(node)) {
							this.log("Removing hidden node - " + matchString);
							node = this._removeAndGetNext(node);
							continue;
						}
						if (node.getAttribute("aria-modal") == "true" && node.getAttribute("role") == "dialog") {
							node = this._removeAndGetNext(node);
							continue;
						}
						if (!this._articleByline && !this._metadata.byline && this._isValidByline(node, matchString)) {
							var endOfSearchMarkerNode = this._getNextNode(node, true);
							var next = this._getNextNode(node);
							var itemPropNameNode = null;
							while (next && next != endOfSearchMarkerNode) {
								var itemprop = next.getAttribute("itemprop");
								if (itemprop && itemprop.includes("name")) {
									itemPropNameNode = next;
									break;
								} else next = this._getNextNode(next);
							}
							this._articleByline = (itemPropNameNode ?? node).textContent.trim();
							node = this._removeAndGetNext(node);
							continue;
						}
						if (shouldRemoveTitleHeader && this._headerDuplicatesTitle(node)) {
							this.log("Removing header: ", node.textContent.trim(), this._articleTitle.trim());
							shouldRemoveTitleHeader = false;
							node = this._removeAndGetNext(node);
							continue;
						}
						if (stripUnlikelyCandidates) {
							if (this.REGEXPS.unlikelyCandidates.test(matchString) && !this.REGEXPS.okMaybeItsACandidate.test(matchString) && !this._hasAncestorTag(node, "table") && !this._hasAncestorTag(node, "code") && node.tagName !== "BODY" && node.tagName !== "A") {
								this.log("Removing unlikely candidate - " + matchString);
								node = this._removeAndGetNext(node);
								continue;
							}
							if (this.UNLIKELY_ROLES.includes(node.getAttribute("role"))) {
								this.log("Removing content with role " + node.getAttribute("role") + " - " + matchString);
								node = this._removeAndGetNext(node);
								continue;
							}
						}
						if ((node.tagName === "DIV" || node.tagName === "SECTION" || node.tagName === "HEADER" || node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") && this._isElementWithoutContent(node)) {
							node = this._removeAndGetNext(node);
							continue;
						}
						if (this.DEFAULT_TAGS_TO_SCORE.includes(node.tagName)) elementsToScore.push(node);
						if (node.tagName === "DIV") {
							var p = null;
							var childNode = node.firstChild;
							while (childNode) {
								var nextSibling = childNode.nextSibling;
								if (this._isPhrasingContent(childNode)) {
									if (p !== null) p.appendChild(childNode);
									else if (!this._isWhitespace(childNode)) {
										p = doc.createElement("p");
										node.replaceChild(p, childNode);
										p.appendChild(childNode);
									}
								} else if (p !== null) {
									while (p.lastChild && this._isWhitespace(p.lastChild)) p.lastChild.remove();
									p = null;
								}
								childNode = nextSibling;
							}
							if (this._hasSingleTagInsideElement(node, "P") && this._getLinkDensity(node) < .25) {
								var newNode = node.children[0];
								node.parentNode.replaceChild(newNode, node);
								node = newNode;
								elementsToScore.push(node);
							} else if (!this._hasChildBlockElement(node)) {
								node = this._setNodeTag(node, "P");
								elementsToScore.push(node);
							}
						}
						node = this._getNextNode(node);
					}
					/**
					* Loop through all paragraphs, and assign a score to them based on how content-y they look.
					* Then add their score to their parent node.
					*
					* A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
					**/
					var candidates = [];
					this._forEachNode(elementsToScore, function(elementToScore) {
						if (!elementToScore.parentNode || typeof elementToScore.parentNode.tagName === "undefined") return;
						var innerText = this._getInnerText(elementToScore);
						if (innerText.length < 25) return;
						var ancestors = this._getNodeAncestors(elementToScore, 5);
						if (ancestors.length === 0) return;
						var contentScore = 0;
						contentScore += 1;
						contentScore += innerText.split(this.REGEXPS.commas).length;
						contentScore += Math.min(Math.floor(innerText.length / 100), 3);
						this._forEachNode(ancestors, function(ancestor, level) {
							if (!ancestor.tagName || !ancestor.parentNode || typeof ancestor.parentNode.tagName === "undefined") return;
							if (typeof ancestor.readability === "undefined") {
								this._initializeNode(ancestor);
								candidates.push(ancestor);
							}
							if (level === 0) var scoreDivider = 1;
							else if (level === 1) scoreDivider = 2;
							else scoreDivider = level * 3;
							ancestor.readability.contentScore += contentScore / scoreDivider;
						});
					});
					var topCandidates = [];
					for (var c = 0, cl = candidates.length; c < cl; c += 1) {
						var candidate = candidates[c];
						var candidateScore = candidate.readability.contentScore * (1 - this._getLinkDensity(candidate));
						candidate.readability.contentScore = candidateScore;
						this.log("Candidate:", candidate, "with score " + candidateScore);
						for (var t = 0; t < this._nbTopCandidates; t++) {
							var aTopCandidate = topCandidates[t];
							if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
								topCandidates.splice(t, 0, candidate);
								if (topCandidates.length > this._nbTopCandidates) topCandidates.pop();
								break;
							}
						}
					}
					var topCandidate = topCandidates[0] || null;
					var neededToCreateTopCandidate = false;
					var parentOfTopCandidate;
					if (topCandidate === null || topCandidate.tagName === "BODY") {
						topCandidate = doc.createElement("DIV");
						neededToCreateTopCandidate = true;
						while (page.firstChild) {
							this.log("Moving child out:", page.firstChild);
							topCandidate.appendChild(page.firstChild);
						}
						page.appendChild(topCandidate);
						this._initializeNode(topCandidate);
					} else if (topCandidate) {
						var alternativeCandidateAncestors = [];
						for (var i = 1; i < topCandidates.length; i++) if (topCandidates[i].readability.contentScore / topCandidate.readability.contentScore >= .75) alternativeCandidateAncestors.push(this._getNodeAncestors(topCandidates[i]));
						var MINIMUM_TOPCANDIDATES = 3;
						if (alternativeCandidateAncestors.length >= MINIMUM_TOPCANDIDATES) {
							parentOfTopCandidate = topCandidate.parentNode;
							while (parentOfTopCandidate.tagName !== "BODY") {
								var listsContainingThisAncestor = 0;
								for (var ancestorIndex = 0; ancestorIndex < alternativeCandidateAncestors.length && listsContainingThisAncestor < MINIMUM_TOPCANDIDATES; ancestorIndex++) listsContainingThisAncestor += Number(alternativeCandidateAncestors[ancestorIndex].includes(parentOfTopCandidate));
								if (listsContainingThisAncestor >= MINIMUM_TOPCANDIDATES) {
									topCandidate = parentOfTopCandidate;
									break;
								}
								parentOfTopCandidate = parentOfTopCandidate.parentNode;
							}
						}
						if (!topCandidate.readability) this._initializeNode(topCandidate);
						parentOfTopCandidate = topCandidate.parentNode;
						var lastScore = topCandidate.readability.contentScore;
						var scoreThreshold = lastScore / 3;
						while (parentOfTopCandidate.tagName !== "BODY") {
							if (!parentOfTopCandidate.readability) {
								parentOfTopCandidate = parentOfTopCandidate.parentNode;
								continue;
							}
							var parentScore = parentOfTopCandidate.readability.contentScore;
							if (parentScore < scoreThreshold) break;
							if (parentScore > lastScore) {
								topCandidate = parentOfTopCandidate;
								break;
							}
							lastScore = parentOfTopCandidate.readability.contentScore;
							parentOfTopCandidate = parentOfTopCandidate.parentNode;
						}
						parentOfTopCandidate = topCandidate.parentNode;
						while (parentOfTopCandidate.tagName != "BODY" && parentOfTopCandidate.children.length == 1) {
							topCandidate = parentOfTopCandidate;
							parentOfTopCandidate = topCandidate.parentNode;
						}
						if (!topCandidate.readability) this._initializeNode(topCandidate);
					}
					var articleContent = doc.createElement("DIV");
					if (isPaging) articleContent.id = "readability-content";
					var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * .2);
					parentOfTopCandidate = topCandidate.parentNode;
					var siblings = parentOfTopCandidate.children;
					for (var s = 0, sl = siblings.length; s < sl; s++) {
						var sibling = siblings[s];
						var append = false;
						this.log("Looking at sibling node:", sibling, sibling.readability ? "with score " + sibling.readability.contentScore : "");
						this.log("Sibling has score", sibling.readability ? sibling.readability.contentScore : "Unknown");
						if (sibling === topCandidate) append = true;
						else {
							var contentBonus = 0;
							if (sibling.className === topCandidate.className && topCandidate.className !== "") contentBonus += topCandidate.readability.contentScore * .2;
							if (sibling.readability && sibling.readability.contentScore + contentBonus >= siblingScoreThreshold) append = true;
							else if (sibling.nodeName === "P") {
								var linkDensity = this._getLinkDensity(sibling);
								var nodeContent = this._getInnerText(sibling);
								var nodeLength = nodeContent.length;
								if (nodeLength > 80 && linkDensity < .25) append = true;
								else if (nodeLength < 80 && nodeLength > 0 && linkDensity === 0 && nodeContent.search(/\.( |$)/) !== -1) append = true;
							}
						}
						if (append) {
							this.log("Appending node:", sibling);
							if (!this.ALTER_TO_DIV_EXCEPTIONS.includes(sibling.nodeName)) {
								this.log("Altering sibling:", sibling, "to div.");
								sibling = this._setNodeTag(sibling, "DIV");
							}
							articleContent.appendChild(sibling);
							siblings = parentOfTopCandidate.children;
							s -= 1;
							sl -= 1;
						}
					}
					if (this._debug) this.log("Article content pre-prep: " + articleContent.innerHTML);
					this._prepArticle(articleContent);
					if (this._debug) this.log("Article content post-prep: " + articleContent.innerHTML);
					if (neededToCreateTopCandidate) {
						topCandidate.id = "readability-page-1";
						topCandidate.className = "page";
					} else {
						var div = doc.createElement("DIV");
						div.id = "readability-page-1";
						div.className = "page";
						while (articleContent.firstChild) div.appendChild(articleContent.firstChild);
						articleContent.appendChild(div);
					}
					if (this._debug) this.log("Article content after paging: " + articleContent.innerHTML);
					var parseSuccessful = true;
					var textLength = this._getInnerText(articleContent, true).length;
					if (textLength < this._charThreshold) {
						parseSuccessful = false;
						page.innerHTML = pageCacheHtml;
						this._attempts.push({
							articleContent,
							textLength
						});
						if (this._flagIsActive(this.FLAG_STRIP_UNLIKELYS)) this._removeFlag(this.FLAG_STRIP_UNLIKELYS);
						else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) this._removeFlag(this.FLAG_WEIGHT_CLASSES);
						else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY);
						else {
							this._attempts.sort(function(a, b) {
								return b.textLength - a.textLength;
							});
							if (!this._attempts[0].textLength) return null;
							articleContent = this._attempts[0].articleContent;
							parseSuccessful = true;
						}
					}
					if (parseSuccessful) {
						var ancestors = [parentOfTopCandidate, topCandidate].concat(this._getNodeAncestors(parentOfTopCandidate));
						this._someNode(ancestors, function(ancestor) {
							if (!ancestor.tagName) return false;
							var articleDir = ancestor.getAttribute("dir");
							if (articleDir) {
								this._articleDir = articleDir;
								return true;
							}
							return false;
						});
						return articleContent;
					}
				}
			},
			/**
			* Converts some of the common HTML entities in string to their corresponding characters.
			*
			* @param str {string} - a string to unescape.
			* @return string without HTML entity.
			*/
			_unescapeHtmlEntities(str) {
				if (!str) return str;
				var htmlEscapeMap = this.HTML_ESCAPE_MAP;
				return str.replace(/&(quot|amp|apos|lt|gt);/g, function(_, tag) {
					return htmlEscapeMap[tag];
				}).replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, function(_, hex, numStr) {
					var num = parseInt(hex || numStr, hex ? 16 : 10);
					if (num == 0 || num > 1114111 || num >= 55296 && num <= 57343) num = 65533;
					return String.fromCodePoint(num);
				});
			},
			/**
			* Try to extract metadata from JSON-LD object.
			* For now, only Schema.org objects of type Article or its subtypes are supported.
			* @return Object with any metadata that could be extracted (possibly none)
			*/
			_getJSONLD(doc) {
				var scripts = this._getAllNodesWithTag(doc, ["script"]);
				var metadata;
				this._forEachNode(scripts, function(jsonLdElement) {
					if (!metadata && jsonLdElement.getAttribute("type") === "application/ld+json") try {
						var content = jsonLdElement.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, "");
						var parsed = JSON.parse(content);
						if (Array.isArray(parsed)) {
							parsed = parsed.find((it) => {
								return it["@type"] && it["@type"].match(this.REGEXPS.jsonLdArticleTypes);
							});
							if (!parsed) return;
						}
						var schemaDotOrgRegex = /^https?\:\/\/schema\.org\/?$/;
						if (!(typeof parsed["@context"] === "string" && parsed["@context"].match(schemaDotOrgRegex) || typeof parsed["@context"] === "object" && typeof parsed["@context"]["@vocab"] == "string" && parsed["@context"]["@vocab"].match(schemaDotOrgRegex))) return;
						if (!parsed["@type"] && Array.isArray(parsed["@graph"])) parsed = parsed["@graph"].find((it) => {
							return (it["@type"] || "").match(this.REGEXPS.jsonLdArticleTypes);
						});
						if (!parsed || !parsed["@type"] || !parsed["@type"].match(this.REGEXPS.jsonLdArticleTypes)) return;
						metadata = {};
						if (typeof parsed.name === "string" && typeof parsed.headline === "string" && parsed.name !== parsed.headline) {
							var title = this._getArticleTitle();
							var nameMatches = this._textSimilarity(parsed.name, title) > .75;
							if (this._textSimilarity(parsed.headline, title) > .75 && !nameMatches) metadata.title = parsed.headline;
							else metadata.title = parsed.name;
						} else if (typeof parsed.name === "string") metadata.title = parsed.name.trim();
						else if (typeof parsed.headline === "string") metadata.title = parsed.headline.trim();
						if (parsed.author) {
							if (typeof parsed.author.name === "string") metadata.byline = parsed.author.name.trim();
							else if (Array.isArray(parsed.author) && parsed.author[0] && typeof parsed.author[0].name === "string") metadata.byline = parsed.author.filter(function(author) {
								return author && typeof author.name === "string";
							}).map(function(author) {
								return author.name.trim();
							}).join(", ");
						}
						if (typeof parsed.description === "string") metadata.excerpt = parsed.description.trim();
						if (parsed.publisher && typeof parsed.publisher.name === "string") metadata.siteName = parsed.publisher.name.trim();
						if (typeof parsed.datePublished === "string") metadata.datePublished = parsed.datePublished.trim();
					} catch (err) {
						this.log(err.message);
					}
				});
				return metadata ? metadata : {};
			},
			/**
			* Attempts to get excerpt and byline metadata for the article.
			*
			* @param {Object} jsonld — object containing any metadata that
			* could be extracted from JSON-LD object.
			*
			* @return Object with optional "excerpt" and "byline" properties
			*/
			_getArticleMetadata(jsonld) {
				var metadata = {};
				var values = {};
				var metaElements = this._doc.getElementsByTagName("meta");
				var propertyPattern = /\s*(article|dc|dcterm|og|twitter)\s*:\s*(author|creator|description|published_time|title|site_name)\s*/gi;
				var namePattern = /^\s*(?:(dc|dcterm|og|twitter|parsely|weibo:(article|webpage))\s*[-\.:]\s*)?(author|creator|pub-date|description|title|site_name)\s*$/i;
				this._forEachNode(metaElements, function(element) {
					var elementName = element.getAttribute("name");
					var elementProperty = element.getAttribute("property");
					var content = element.getAttribute("content");
					if (!content) return;
					var matches = null;
					var name = null;
					if (elementProperty) {
						matches = elementProperty.match(propertyPattern);
						if (matches) {
							name = matches[0].toLowerCase().replace(/\s/g, "");
							values[name] = content.trim();
						}
					}
					if (!matches && elementName && namePattern.test(elementName)) {
						name = elementName;
						if (content) {
							name = name.toLowerCase().replace(/\s/g, "").replace(/\./g, ":");
							values[name] = content.trim();
						}
					}
				});
				metadata.title = jsonld.title || values["dc:title"] || values["dcterm:title"] || values["og:title"] || values["weibo:article:title"] || values["weibo:webpage:title"] || values.title || values["twitter:title"] || values["parsely-title"];
				if (!metadata.title) metadata.title = this._getArticleTitle();
				const articleAuthor = typeof values["article:author"] === "string" && !this._isUrl(values["article:author"]) ? values["article:author"] : void 0;
				metadata.byline = jsonld.byline || values["dc:creator"] || values["dcterm:creator"] || values.author || values["parsely-author"] || articleAuthor;
				metadata.excerpt = jsonld.excerpt || values["dc:description"] || values["dcterm:description"] || values["og:description"] || values["weibo:article:description"] || values["weibo:webpage:description"] || values.description || values["twitter:description"];
				metadata.siteName = jsonld.siteName || values["og:site_name"];
				metadata.publishedTime = jsonld.datePublished || values["article:published_time"] || values["parsely-pub-date"] || null;
				metadata.title = this._unescapeHtmlEntities(metadata.title);
				metadata.byline = this._unescapeHtmlEntities(metadata.byline);
				metadata.excerpt = this._unescapeHtmlEntities(metadata.excerpt);
				metadata.siteName = this._unescapeHtmlEntities(metadata.siteName);
				metadata.publishedTime = this._unescapeHtmlEntities(metadata.publishedTime);
				return metadata;
			},
			/**
			* Check if node is image, or if node contains exactly only one image
			* whether as a direct child or as its descendants.
			*
			* @param Element
			**/
			_isSingleImage(node) {
				while (node) {
					if (node.tagName === "IMG") return true;
					if (node.children.length !== 1 || node.textContent.trim() !== "") return false;
					node = node.children[0];
				}
				return false;
			},
			/**
			* Find all <noscript> that are located after <img> nodes, and which contain only one
			* <img> element. Replace the first image with the image from inside the <noscript> tag,
			* and remove the <noscript> tag. This improves the quality of the images we use on
			* some sites (e.g. Medium).
			*
			* @param Element
			**/
			_unwrapNoscriptImages(doc) {
				var imgs = Array.from(doc.getElementsByTagName("img"));
				this._forEachNode(imgs, function(img) {
					for (var i = 0; i < img.attributes.length; i++) {
						var attr = img.attributes[i];
						switch (attr.name) {
							case "src":
							case "srcset":
							case "data-src":
							case "data-srcset": return;
						}
						if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) return;
					}
					img.remove();
				});
				var noscripts = Array.from(doc.getElementsByTagName("noscript"));
				this._forEachNode(noscripts, function(noscript) {
					if (!this._isSingleImage(noscript)) return;
					var tmp = doc.createElement("div");
					tmp.innerHTML = noscript.innerHTML;
					var prevElement = noscript.previousElementSibling;
					if (prevElement && this._isSingleImage(prevElement)) {
						var prevImg = prevElement;
						if (prevImg.tagName !== "IMG") prevImg = prevElement.getElementsByTagName("img")[0];
						var newImg = tmp.getElementsByTagName("img")[0];
						for (var i = 0; i < prevImg.attributes.length; i++) {
							var attr = prevImg.attributes[i];
							if (attr.value === "") continue;
							if (attr.name === "src" || attr.name === "srcset" || /\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
								if (newImg.getAttribute(attr.name) === attr.value) continue;
								var attrName = attr.name;
								if (newImg.hasAttribute(attrName)) attrName = "data-old-" + attrName;
								newImg.setAttribute(attrName, attr.value);
							}
						}
						noscript.parentNode.replaceChild(tmp.firstElementChild, prevElement);
					}
				});
			},
			/**
			* Removes script tags from the document.
			*
			* @param Element
			**/
			_removeScripts(doc) {
				this._removeNodes(this._getAllNodesWithTag(doc, ["script", "noscript"]));
			},
			/**
			* Check if this node has only whitespace and a single element with given tag
			* Returns false if the DIV node contains non-empty text nodes
			* or if it contains no element with given tag or more than 1 element.
			*
			* @param Element
			* @param string tag of child element
			**/
			_hasSingleTagInsideElement(element, tag) {
				if (element.children.length != 1 || element.children[0].tagName !== tag) return false;
				return !this._someNode(element.childNodes, function(node) {
					return node.nodeType === this.TEXT_NODE && this.REGEXPS.hasContent.test(node.textContent);
				});
			},
			_isElementWithoutContent(node) {
				return node.nodeType === this.ELEMENT_NODE && !node.textContent.trim().length && (!node.children.length || node.children.length == node.getElementsByTagName("br").length + node.getElementsByTagName("hr").length);
			},
			/**
			* Determine whether element has any children block level elements.
			*
			* @param Element
			*/
			_hasChildBlockElement(element) {
				return this._someNode(element.childNodes, function(node) {
					return this.DIV_TO_P_ELEMS.has(node.tagName) || this._hasChildBlockElement(node);
				});
			},
			/***
			* Determine if a node qualifies as phrasing content.
			* https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
			**/
			_isPhrasingContent(node) {
				return node.nodeType === this.TEXT_NODE || this.PHRASING_ELEMS.includes(node.tagName) || (node.tagName === "A" || node.tagName === "DEL" || node.tagName === "INS") && this._everyNode(node.childNodes, this._isPhrasingContent);
			},
			_isWhitespace(node) {
				return node.nodeType === this.TEXT_NODE && node.textContent.trim().length === 0 || node.nodeType === this.ELEMENT_NODE && node.tagName === "BR";
			},
			/**
			* Get the inner text of a node - cross browser compatibly.
			* This also strips out any excess whitespace to be found.
			*
			* @param Element
			* @param Boolean normalizeSpaces (default: true)
			* @return string
			**/
			_getInnerText(e, normalizeSpaces) {
				normalizeSpaces = typeof normalizeSpaces === "undefined" ? true : normalizeSpaces;
				var textContent = e.textContent.trim();
				if (normalizeSpaces) return textContent.replace(this.REGEXPS.normalize, " ");
				return textContent;
			},
			/**
			* Get the number of times a string s appears in the node e.
			*
			* @param Element
			* @param string - what to split on. Default is ","
			* @return number (integer)
			**/
			_getCharCount(e, s) {
				s = s || ",";
				return this._getInnerText(e).split(s).length - 1;
			},
			/**
			* Remove the style attribute on every e and under.
			* TODO: Test if getElementsByTagName(*) is faster.
			*
			* @param Element
			* @return void
			**/
			_cleanStyles(e) {
				if (!e || e.tagName.toLowerCase() === "svg") return;
				for (var i = 0; i < this.PRESENTATIONAL_ATTRIBUTES.length; i++) e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[i]);
				if (this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.includes(e.tagName)) {
					e.removeAttribute("width");
					e.removeAttribute("height");
				}
				var cur = e.firstElementChild;
				while (cur !== null) {
					this._cleanStyles(cur);
					cur = cur.nextElementSibling;
				}
			},
			/**
			* Get the density of links as a percentage of the content
			* This is the amount of text that is inside a link divided by the total text in the node.
			*
			* @param Element
			* @return number (float)
			**/
			_getLinkDensity(element) {
				var textLength = this._getInnerText(element).length;
				if (textLength === 0) return 0;
				var linkLength = 0;
				this._forEachNode(element.getElementsByTagName("a"), function(linkNode) {
					var href = linkNode.getAttribute("href");
					var coefficient = href && this.REGEXPS.hashUrl.test(href) ? .3 : 1;
					linkLength += this._getInnerText(linkNode).length * coefficient;
				});
				return linkLength / textLength;
			},
			/**
			* Get an elements class/id weight. Uses regular expressions to tell if this
			* element looks good or bad.
			*
			* @param Element
			* @return number (Integer)
			**/
			_getClassWeight(e) {
				if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) return 0;
				var weight = 0;
				if (typeof e.className === "string" && e.className !== "") {
					if (this.REGEXPS.negative.test(e.className)) weight -= 25;
					if (this.REGEXPS.positive.test(e.className)) weight += 25;
				}
				if (typeof e.id === "string" && e.id !== "") {
					if (this.REGEXPS.negative.test(e.id)) weight -= 25;
					if (this.REGEXPS.positive.test(e.id)) weight += 25;
				}
				return weight;
			},
			/**
			* Clean a node of all elements of type "tag".
			* (Unless it's a youtube/vimeo video. People love movies.)
			*
			* @param Element
			* @param string tag to clean
			* @return void
			**/
			_clean(e, tag) {
				var isEmbed = [
					"object",
					"embed",
					"iframe"
				].includes(tag);
				this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(element) {
					if (isEmbed) {
						for (var i = 0; i < element.attributes.length; i++) if (this._allowedVideoRegex.test(element.attributes[i].value)) return false;
						if (element.tagName === "object" && this._allowedVideoRegex.test(element.innerHTML)) return false;
					}
					return true;
				});
			},
			/**
			* Check if a given node has one of its ancestor tag name matching the
			* provided one.
			* @param  HTMLElement node
			* @param  String      tagName
			* @param  Number      maxDepth
			* @param  Function    filterFn a filter to invoke to determine whether this node 'counts'
			* @return Boolean
			*/
			_hasAncestorTag(node, tagName, maxDepth, filterFn) {
				maxDepth = maxDepth || 3;
				tagName = tagName.toUpperCase();
				var depth = 0;
				while (node.parentNode) {
					if (maxDepth > 0 && depth > maxDepth) return false;
					if (node.parentNode.tagName === tagName && (!filterFn || filterFn(node.parentNode))) return true;
					node = node.parentNode;
					depth++;
				}
				return false;
			},
			/**
			* Return an object indicating how many rows and columns this table has.
			*/
			_getRowAndColumnCount(table) {
				var rows = 0;
				var columns = 0;
				var trs = table.getElementsByTagName("tr");
				for (var i = 0; i < trs.length; i++) {
					var rowspan = trs[i].getAttribute("rowspan") || 0;
					if (rowspan) rowspan = parseInt(rowspan, 10);
					rows += rowspan || 1;
					var columnsInThisRow = 0;
					var cells = trs[i].getElementsByTagName("td");
					for (var j = 0; j < cells.length; j++) {
						var colspan = cells[j].getAttribute("colspan") || 0;
						if (colspan) colspan = parseInt(colspan, 10);
						columnsInThisRow += colspan || 1;
					}
					columns = Math.max(columns, columnsInThisRow);
				}
				return {
					rows,
					columns
				};
			},
			/**
			* Look for 'data' (as opposed to 'layout') tables, for which we use
			* similar checks as
			* https://searchfox.org/mozilla-central/rev/f82d5c549f046cb64ce5602bfd894b7ae807c8f8/accessible/generic/TableAccessible.cpp#19
			*/
			_markDataTables(root) {
				var tables = root.getElementsByTagName("table");
				for (var i = 0; i < tables.length; i++) {
					var table = tables[i];
					if (table.getAttribute("role") == "presentation") {
						table._readabilityDataTable = false;
						continue;
					}
					if (table.getAttribute("datatable") == "0") {
						table._readabilityDataTable = false;
						continue;
					}
					if (table.getAttribute("summary")) {
						table._readabilityDataTable = true;
						continue;
					}
					var caption = table.getElementsByTagName("caption")[0];
					if (caption && caption.childNodes.length) {
						table._readabilityDataTable = true;
						continue;
					}
					var dataTableDescendants = [
						"col",
						"colgroup",
						"tfoot",
						"thead",
						"th"
					];
					var descendantExists = function(tag) {
						return !!table.getElementsByTagName(tag)[0];
					};
					if (dataTableDescendants.some(descendantExists)) {
						this.log("Data table because found data-y descendant");
						table._readabilityDataTable = true;
						continue;
					}
					if (table.getElementsByTagName("table")[0]) {
						table._readabilityDataTable = false;
						continue;
					}
					var sizeInfo = this._getRowAndColumnCount(table);
					if (sizeInfo.columns == 1 || sizeInfo.rows == 1) {
						table._readabilityDataTable = false;
						continue;
					}
					if (sizeInfo.rows >= 10 || sizeInfo.columns > 4) {
						table._readabilityDataTable = true;
						continue;
					}
					table._readabilityDataTable = sizeInfo.rows * sizeInfo.columns > 10;
				}
			},
			_fixLazyImages(root) {
				this._forEachNode(this._getAllNodesWithTag(root, [
					"img",
					"picture",
					"figure"
				]), function(elem) {
					if (elem.src && this.REGEXPS.b64DataUrl.test(elem.src)) {
						var parts = this.REGEXPS.b64DataUrl.exec(elem.src);
						if (parts[1] === "image/svg+xml") return;
						var srcCouldBeRemoved = false;
						for (var i = 0; i < elem.attributes.length; i++) {
							var attr = elem.attributes[i];
							if (attr.name === "src") continue;
							if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
								srcCouldBeRemoved = true;
								break;
							}
						}
						if (srcCouldBeRemoved) {
							var b64starts = parts[0].length;
							if (elem.src.length - b64starts < 133) elem.removeAttribute("src");
						}
					}
					if ((elem.src || elem.srcset && elem.srcset != "null") && !elem.className.toLowerCase().includes("lazy")) return;
					for (var j = 0; j < elem.attributes.length; j++) {
						attr = elem.attributes[j];
						if (attr.name === "src" || attr.name === "srcset" || attr.name === "alt") continue;
						var copyTo = null;
						if (/\.(jpg|jpeg|png|webp)\s+\d/.test(attr.value)) copyTo = "srcset";
						else if (/^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(attr.value)) copyTo = "src";
						if (copyTo) {
							if (elem.tagName === "IMG" || elem.tagName === "PICTURE") elem.setAttribute(copyTo, attr.value);
							else if (elem.tagName === "FIGURE" && !this._getAllNodesWithTag(elem, ["img", "picture"]).length) {
								var img = this._doc.createElement("img");
								img.setAttribute(copyTo, attr.value);
								elem.appendChild(img);
							}
						}
					}
				});
			},
			_getTextDensity(e, tags) {
				var textLength = this._getInnerText(e, true).length;
				if (textLength === 0) return 0;
				var childrenLength = 0;
				var children = this._getAllNodesWithTag(e, tags);
				this._forEachNode(children, (child) => childrenLength += this._getInnerText(child, true).length);
				return childrenLength / textLength;
			},
			/**
			* Clean an element of all tags of type "tag" if they look fishy.
			* "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
			*
			* @return void
			**/
			_cleanConditionally(e, tag) {
				if (!this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) return;
				this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(node) {
					var isDataTable = function(t) {
						return t._readabilityDataTable;
					};
					var isList = tag === "ul" || tag === "ol";
					if (!isList) {
						var listLength = 0;
						var listNodes = this._getAllNodesWithTag(node, ["ul", "ol"]);
						this._forEachNode(listNodes, (list) => listLength += this._getInnerText(list).length);
						isList = listLength / this._getInnerText(node).length > .9;
					}
					if (tag === "table" && isDataTable(node)) return false;
					if (this._hasAncestorTag(node, "table", -1, isDataTable)) return false;
					if (this._hasAncestorTag(node, "code")) return false;
					if ([...node.getElementsByTagName("table")].some((tbl) => tbl._readabilityDataTable)) return false;
					var weight = this._getClassWeight(node);
					this.log("Cleaning Conditionally", node);
					if (weight + 0 < 0) return true;
					if (this._getCharCount(node, ",") < 10) {
						var p = node.getElementsByTagName("p").length;
						var img = node.getElementsByTagName("img").length;
						var li = node.getElementsByTagName("li").length - 100;
						var input = node.getElementsByTagName("input").length;
						var headingDensity = this._getTextDensity(node, [
							"h1",
							"h2",
							"h3",
							"h4",
							"h5",
							"h6"
						]);
						var embedCount = 0;
						var embeds = this._getAllNodesWithTag(node, [
							"object",
							"embed",
							"iframe"
						]);
						for (var i = 0; i < embeds.length; i++) {
							for (var j = 0; j < embeds[i].attributes.length; j++) if (this._allowedVideoRegex.test(embeds[i].attributes[j].value)) return false;
							if (embeds[i].tagName === "object" && this._allowedVideoRegex.test(embeds[i].innerHTML)) return false;
							embedCount++;
						}
						var innerText = this._getInnerText(node);
						if (this.REGEXPS.adWords.test(innerText) || this.REGEXPS.loadingWords.test(innerText)) return true;
						var contentLength = innerText.length;
						var linkDensity = this._getLinkDensity(node);
						var textishTags = [
							"SPAN",
							"LI",
							"TD"
						].concat(Array.from(this.DIV_TO_P_ELEMS));
						var textDensity = this._getTextDensity(node, textishTags);
						var isFigureChild = this._hasAncestorTag(node, "figure");
						const shouldRemoveNode = () => {
							const errs = [];
							if (!isFigureChild && img > 1 && p / img < .5) errs.push(`Bad p to img ratio (img=${img}, p=${p})`);
							if (!isList && li > p) errs.push(`Too many li's outside of a list. (li=${li} > p=${p})`);
							if (input > Math.floor(p / 3)) errs.push(`Too many inputs per p. (input=${input}, p=${p})`);
							if (!isList && !isFigureChild && headingDensity < .9 && contentLength < 25 && (img === 0 || img > 2) && linkDensity > 0) errs.push(`Suspiciously short. (headingDensity=${headingDensity}, img=${img}, linkDensity=${linkDensity})`);
							if (!isList && weight < 25 && linkDensity > .2 + this._linkDensityModifier) errs.push(`Low weight and a little linky. (linkDensity=${linkDensity})`);
							if (weight >= 25 && linkDensity > .5 + this._linkDensityModifier) errs.push(`High weight and mostly links. (linkDensity=${linkDensity})`);
							if (embedCount === 1 && contentLength < 75 || embedCount > 1) errs.push(`Suspicious embed. (embedCount=${embedCount}, contentLength=${contentLength})`);
							if (img === 0 && textDensity === 0) errs.push(`No useful content. (img=${img}, textDensity=${textDensity})`);
							if (errs.length) {
								this.log("Checks failed", errs);
								return true;
							}
							return false;
						};
						var haveToRemove = shouldRemoveNode();
						if (isList && haveToRemove) {
							for (var x = 0; x < node.children.length; x++) if (node.children[x].children.length > 1) return haveToRemove;
							if (img == node.getElementsByTagName("li").length) return false;
						}
						return haveToRemove;
					}
					return false;
				});
			},
			/**
			* Clean out elements that match the specified conditions
			*
			* @param Element
			* @param Function determines whether a node should be removed
			* @return void
			**/
			_cleanMatchedNodes(e, filter) {
				var endOfSearchMarkerNode = this._getNextNode(e, true);
				var next = this._getNextNode(e);
				while (next && next != endOfSearchMarkerNode) if (filter.call(this, next, next.className + " " + next.id)) next = this._removeAndGetNext(next);
				else next = this._getNextNode(next);
			},
			/**
			* Clean out spurious headers from an Element.
			*
			* @param Element
			* @return void
			**/
			_cleanHeaders(e) {
				let headingNodes = this._getAllNodesWithTag(e, ["h1", "h2"]);
				this._removeNodes(headingNodes, function(node) {
					let shouldRemove = this._getClassWeight(node) < 0;
					if (shouldRemove) this.log("Removing header with low class weight:", node);
					return shouldRemove;
				});
			},
			/**
			* Check if this node is an H1 or H2 element whose content is mostly
			* the same as the article title.
			*
			* @param Element  the node to check.
			* @return boolean indicating whether this is a title-like header.
			*/
			_headerDuplicatesTitle(node) {
				if (node.tagName != "H1" && node.tagName != "H2") return false;
				var heading = this._getInnerText(node, false);
				this.log("Evaluating similarity of header:", heading, this._articleTitle);
				return this._textSimilarity(this._articleTitle, heading) > .75;
			},
			_flagIsActive(flag) {
				return (this._flags & flag) > 0;
			},
			_removeFlag(flag) {
				this._flags = this._flags & ~flag;
			},
			_isProbablyVisible(node) {
				return (!node.style || node.style.display != "none") && (!node.style || node.style.visibility != "hidden") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.includes && node.className.includes("fallback-image"));
			},
			/**
			* Runs readability.
			*
			* Workflow:
			*  1. Prep the document by removing script tags, css, etc.
			*  2. Build readability's DOM tree.
			*  3. Grab the article content from the current dom tree.
			*  4. Replace the current DOM tree with the new one.
			*  5. Read peacefully.
			*
			* @return void
			**/
			parse() {
				if (this._maxElemsToParse > 0) {
					var numTags = this._doc.getElementsByTagName("*").length;
					if (numTags > this._maxElemsToParse) throw new Error("Aborting parsing document; " + numTags + " elements found");
				}
				this._unwrapNoscriptImages(this._doc);
				var jsonLd = this._disableJSONLD ? {} : this._getJSONLD(this._doc);
				this._removeScripts(this._doc);
				this._prepDocument();
				var metadata = this._getArticleMetadata(jsonLd);
				this._metadata = metadata;
				this._articleTitle = metadata.title;
				var articleContent = this._grabArticle();
				if (!articleContent) return null;
				this.log("Grabbed: " + articleContent.innerHTML);
				this._postProcessContent(articleContent);
				if (!metadata.excerpt) {
					var paragraphs = articleContent.getElementsByTagName("p");
					if (paragraphs.length) metadata.excerpt = paragraphs[0].textContent.trim();
				}
				var textContent = articleContent.textContent;
				return {
					title: this._articleTitle,
					byline: metadata.byline || this._articleByline,
					dir: this._articleDir,
					lang: this._articleLang,
					content: this._serializer(articleContent),
					textContent,
					length: textContent.length,
					excerpt: metadata.excerpt,
					siteName: metadata.siteName || this._articleSiteName,
					publishedTime: metadata.publishedTime
				};
			}
		};
		if (typeof module === "object") module.exports = Readability;
	}));
	//#endregion
	//#region node_modules/@mozilla/readability/Readability-readerable.js
	var require_Readability_readerable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var REGEXPS = {
			unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
			okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i
		};
		function isNodeVisible(node) {
			return (!node.style || node.style.display != "none") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.includes && node.className.includes("fallback-image"));
		}
		/**
		* Decides whether or not the document is reader-able without parsing the whole thing.
		* @param {Object} options Configuration object.
		* @param {number} [options.minContentLength=140] The minimum node content length used to decide if the document is readerable.
		* @param {number} [options.minScore=20] The minumum cumulated 'score' used to determine if the document is readerable.
		* @param {Function} [options.visibilityChecker=isNodeVisible] The function used to determine if a node is visible.
		* @return {boolean} Whether or not we suspect Readability.parse() will suceeed at returning an article object.
		*/
		function isProbablyReaderable(doc, options = {}) {
			if (typeof options == "function") options = { visibilityChecker: options };
			options = Object.assign({
				minScore: 20,
				minContentLength: 140,
				visibilityChecker: isNodeVisible
			}, options);
			var nodes = doc.querySelectorAll("p, pre, article");
			var brNodes = doc.querySelectorAll("div > br");
			if (brNodes.length) {
				var set = new Set(nodes);
				[].forEach.call(brNodes, function(node) {
					set.add(node.parentNode);
				});
				nodes = Array.from(set);
			}
			var score = 0;
			return [].some.call(nodes, function(node) {
				if (!options.visibilityChecker(node)) return false;
				var matchString = node.className + " " + node.id;
				if (REGEXPS.unlikelyCandidates.test(matchString) && !REGEXPS.okMaybeItsACandidate.test(matchString)) return false;
				if (node.matches("li p")) return false;
				var textContentLength = node.textContent.trim().length;
				if (textContentLength < options.minContentLength) return false;
				score += Math.sqrt(textContentLength - options.minContentLength);
				if (score > options.minScore) return true;
				return false;
			});
		}
		if (typeof module === "object") module.exports = isProbablyReaderable;
	}));
	//#endregion
	//#region shared/textrank.ts
	var import_readability = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {
			Readability: require_Readability(),
			isProbablyReaderable: require_Readability_readerable()
		};
	})))();
	/**
	* TextRank Algoritması ile Türkçe Metin Özetleme Modülü
	*
	* Mihalcea & Tarau (2004) tarafından önerilen TextRank algoritmasını kullanarak
	* metin içerisinden en önemli cümleleri çıkarır (extractive summarization).
	*/
	/**
	* Türkçe etkisiz kelimeler (stop words) listesi
	*/
	var TURKISH_STOP_WORDS = /* @__PURE__ */ new Set([
		"bir",
		"bu",
		"şu",
		"o",
		"ve",
		"ile",
		"de",
		"da",
		"için",
		"gibi",
		"daha",
		"çok",
		"her",
		"ne",
		"ama",
		"ancak",
		"ki",
		"ya",
		"hem",
		"veya",
		"ise",
		"ben",
		"sen",
		"biz",
		"siz",
		"var",
		"yok",
		"olan",
		"olarak",
		"den",
		"dan",
		"dır",
		"dir",
		"mı",
		"mi",
		"mu",
		"mü",
		"kadar",
		"sonra",
		"önce",
		"arasında",
		"üzerinde",
		"altında",
		"beri",
		"böyle",
		"şöyle",
		"hangi",
		"kendi",
		"aynı",
		"diğer",
		"bazı",
		"tüm",
		"en",
		"hiç"
	]);
	/**
	* Metni cümlelere ayırır.
	* Türkçe noktalama işaretlerini (. ! ? …) dikkate alır.
	*
	* @param text Ayrıştırılacak metin
	* @returns Cümle dizisi
	*/
	function splitIntoSentences(text) {
		if (!text || !text.trim()) return [];
		return text.split(/(?<=[.!?…]+)\s+/).map((s) => s.trim()).filter((s) => s.length > 0);
	}
	/**
	* Cümleyi kelimelere (token) ayırır.
	* Küçük harfe dönüştürür (Türkçe karakter uyumlu), noktalama işaretlerini temizler
	* ve etkisiz kelimeleri (stop words) filtreler.
	*
	* @param sentence Cümle metni
	* @returns Filtrelenmiş kelime dizisi
	*/
	function tokenize(sentence) {
		return sentence.toLocaleLowerCase("tr-TR").replace(/[^a-zçğıöşü0-9\s]/gi, " ").split(/\s+/).filter((word) => word.length > 0 && !TURKISH_STOP_WORDS.has(word));
	}
	/**
	* İki cümle arasındaki benzerlik skorunu hesaplar.
	* Formül: Ortak etkisiz olmayan kelime sayısı / (log(len1) + log(len2))
	*
	* @param words1 1. cümlenin filtrelenmiş kelimeleri
	* @param words2 2. cümlenin filtrelenmiş kelimeleri
	* @returns Benzerlik skoru
	*/
	function calculateSimilarity(words1, words2) {
		if (words1.length === 0 || words2.length === 0) return 0;
		const set1 = new Set(words1);
		const set2 = new Set(words2);
		let sharedWordsCount = 0;
		for (const word of set1) if (set2.has(word)) sharedWordsCount++;
		if (sharedWordsCount === 0) return 0;
		const denom = Math.log(words1.length) + Math.log(words2.length);
		if (denom <= 0) return sharedWordsCount;
		return sharedWordsCount / denom;
	}
	/**
	* Cümleler üzerinde PageRank algoritmasını çalıştırarak önem skorlarını hesaplar.
	*
	* @param similarityMatrix Cümleler arası benzerlik matrisi
	* @param dampingFactor Sönümleme katsayısı (varsayılan: 0.85)
	* @param iterations İterasyon sayısı (varsayılan: 30)
	* @returns Her cümlenin PageRank skoru dizisi
	*/
	function runPageRank(similarityMatrix, dampingFactor = .85, iterations = 30) {
		const n = similarityMatrix.length;
		if (n === 0) return [];
		let scores = new Array(n).fill(1);
		const weightSums = similarityMatrix.map((row) => row.reduce((acc, val) => acc + val, 0));
		for (let iter = 0; iter < iterations; iter++) {
			const nextScores = new Array(n).fill(1 - dampingFactor);
			for (let i = 0; i < n; i++) {
				let sum = 0;
				for (let j = 0; j < n; j++) if (i !== j && weightSums[j] > 0) sum += similarityMatrix[j][i] / weightSums[j] * scores[j];
				nextScores[i] += dampingFactor * sum;
			}
			scores = nextScores;
		}
		return scores;
	}
	/**
	* Verilen metni TextRank algoritması kullanarak özetler.
	*
	* @param text Özetlenecek Türkçe metin
	* @param maxSentences İstenen maksimum cümle sayısı (belirtilmezse otomatik hesaplanır)
	* @returns Özet metin (seçilen cümleler orijinal sırada birleştirilmiş olarak)
	*/
	function summarize(text, maxSentences) {
		if (!text || !text.trim()) return "";
		const trimmedText = text.trim();
		const sentences = splitIntoSentences(trimmedText);
		if (sentences.length <= 1) return trimmedText;
		const targetCount = typeof maxSentences === "number" && maxSentences > 0 ? maxSentences : Math.max(2, Math.ceil(sentences.length * .3));
		if (sentences.length <= targetCount) return trimmedText;
		const tokenizedSentences = sentences.map((sentence) => tokenize(sentence));
		const n = sentences.length;
		const similarityMatrix = Array.from({ length: n }, () => new Array(n).fill(0));
		for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
			const similarity = calculateSimilarity(tokenizedSentences[i], tokenizedSentences[j]);
			similarityMatrix[i][j] = similarity;
			similarityMatrix[j][i] = similarity;
		}
		const scores = runPageRank(similarityMatrix, .85, 30);
		const indexedSentences = sentences.map((sentence, index) => ({
			index,
			sentence,
			score: scores[index] ?? 0
		}));
		indexedSentences.sort((a, b) => b.score - a.score);
		const topSentences = indexedSentences.slice(0, targetCount);
		topSentences.sort((a, b) => a.index - b.index);
		return topSentences.map((item) => item.sentence).join(" ");
	}
	//#endregion
	//#region entrypoints/content.ts
	var THEMES = {
		sepia: {
			bg: "#f4ecd8",
			fg: "#3b3226",
			link: "#8b5a2b"
		},
		dark: {
			bg: "#121212",
			fg: "#d6d6d6",
			link: "#7aa2f7"
		},
		light: {
			bg: "#ffffff",
			fg: "#1f2328",
			link: "#2563eb"
		}
	};
	function escapeHtml(s) {
		return s.replace(/[&<>"']/g, (c) => ({
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#39;"
		})[c]);
	}
	function buildReaderHTML(title, content, theme) {
		const t = THEMES[theme];
		return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { margin: 0; background: ${t.bg}; }
  #reader {
    max-width: 42em; margin: 0 auto; padding: 2em 1.25em;
    line-height: 1.75; font-size: 18px;
    font-family: Georgia, 'Times New Roman', serif; color: ${t.fg};
  }
  #reader h1 { font-size: 1.7em; line-height: 1.3; margin: 0 0 0.6em; }
  #reader h2, #reader h3, #reader h4 { line-height: 1.3; margin: 1.2em 0 0.5em; }
  #reader p { margin: 1em 0; }
  #reader a { color: ${t.link}; }
  #reader img, #reader video, #reader picture { max-width: 100%; height: auto; display: block; margin: 1em auto; }
  #reader ul, #reader ol { margin: 1em 0; padding-left: 1.5em; }
  #reader li { margin: 0.3em 0; }
  #reader blockquote { border-left: 3px solid ${t.link}; margin: 1em 0; padding: 0.5em 1em; font-style: italic; }
  #reader pre { background: rgba(128,128,128,0.12); padding: 0.75em 1em; overflow-x: auto; white-space: pre-wrap; }
  #reader code, #reader pre { font-family: ui-monospace, SFMono-Regular, monospace; }
  #reader figure { margin: 0 0 1.5em; }
  #reader figcaption { font-size: 0.85em; opacity: 0.75; margin-top: 0.4em; }
  #reader table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
</style>
</head>
<body>
<div id="reader">
${title ? `<h1>${escapeHtml(title)}</h1>` : ""}
${content}
</div>
</body>
</html>`;
	}
	function resolveLazyImages(doc) {
		doc.querySelectorAll("img[data-src]").forEach((img) => {
			const src = img.getAttribute("data-src");
			if (src) img.setAttribute("src", src);
		});
		doc.querySelectorAll("img[data-srcset]").forEach((img) => {
			const s = img.getAttribute("data-srcset");
			if (s) img.setAttribute("srcset", s);
		});
	}
	function getTitle(doc, fallback) {
		const h1Text = doc.querySelector("h1")?.textContent?.trim();
		if (h1Text) return h1Text;
		const og = doc.querySelector("meta[property=\"og:title\"]")?.getAttribute("content")?.trim();
		if (og) return og;
		return fallback || doc.title || "";
	}
	function getLeadImage(doc) {
		return doc.querySelector("meta[property=\"og:image\"]")?.getAttribute("content") ?? null;
	}
	var frame = null;
	var closeBtn = null;
	var lastArticle = null;
	function renderFrame(theme) {
		if (!lastArticle) return;
		if (!frame) {
			frame = document.createElement("iframe");
			frame.id = "reading-frame";
			frame.setAttribute("sandbox", "allow-same-origin");
			frame.style.cssText = "position: fixed; inset: 0; width: 100%; height: 100%; border: 0; z-index: 2147483647; background: #fff;";
			document.documentElement.appendChild(frame);
			closeBtn = document.createElement("button");
			closeBtn.type = "button";
			closeBtn.textContent = "✕";
			closeBtn.title = "Okuma modunu kapat";
			closeBtn.style.cssText = "position: fixed; top: 14px; right: 14px; z-index: 2147483647; width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(0,0,0,0.55) !important; color: #fff !important; font-size: 18px !important; line-height: 1; cursor: pointer;";
			closeBtn.addEventListener("click", disableReading);
			document.documentElement.appendChild(closeBtn);
		}
		frame.srcdoc = buildReaderHTML(lastArticle.title, lastArticle.content, theme);
	}
	function enableReading(theme) {
		if (frame) {
			renderFrame(theme);
			return true;
		}
		const clone = document.cloneNode(true);
		resolveLazyImages(clone);
		const article = new import_readability.Readability(clone).parse();
		const content = article?.content;
		if (!content) return false;
		const title = getTitle(document, article.title ?? "");
		const leadImage = getLeadImage(document);
		lastArticle = {
			title,
			content: leadImage ? `<figure><img src="${escapeHtml(leadImage)}" alt=""></figure>` + content : content
		};
		renderFrame(theme);
		return true;
	}
	function disableReading() {
		frame?.remove();
		frame = null;
		closeBtn?.remove();
		closeBtn = null;
		lastArticle = null;
	}
	var gesturesEnabled = false;
	var trailEl = null;
	var gTracking = false;
	var gStartX = 0;
	var gStartY = 0;
	var gMoved = false;
	var gSuppressMenu = false;
	async function refreshGesturesFlag() {
		gesturesEnabled = (await browser.storage.local.get("settings")).settings?.gesturesEnabled ?? false;
	}
	/**
	* Hangi eksende daha çok hareket varsa o yön kazanır.
	* En az 40 px hareket gerekir.
	*/
	function detectDirection(dx, dy) {
		const ax = Math.abs(dx);
		const ay = Math.abs(dy);
		if (Math.max(ax, ay) < 40) return null;
		if (ax >= ay) return dx < 0 ? "back" : "forward";
		return dy < 0 ? "scrollTop" : "closeTab";
	}
	function showTrail(x, y) {
		if (!trailEl) {
			trailEl = document.createElement("div");
			trailEl.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;width:24px;height:24px;border-radius:50%;border:3px solid #2563eb;background:rgba(37,99,235,.18);box-shadow:0 0 6px rgba(0,0,0,.25);transform:translate(-50%,-50%);";
			document.documentElement.appendChild(trailEl);
		}
		trailEl.style.left = x + "px";
		trailEl.style.top = y + "px";
	}
	function hideTrail() {
		trailEl?.remove();
		trailEl = null;
	}
	function runAction(action) {
		switch (action) {
			case "scrollTop":
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
				break;
			case "scrollBottom":
				window.scrollTo({
					top: document.documentElement.scrollHeight,
					behavior: "smooth"
				});
				break;
			case "back":
				history.back();
				break;
			case "forward":
				history.forward();
				break;
			case "reload":
				location.reload();
				break;
			case "closeTab":
			case "newTab": try {
				browser.runtime.sendMessage({
					type: "GESTURE",
					action
				}).catch(() => {});
			} catch {
				location.reload();
			}
		}
	}
	function resetGesture() {
		gTracking = false;
		gMoved = false;
		hideTrail();
	}
	var summaryOverlay = null;
	function showSummaryOverlay(summary) {
		closeSummaryOverlay();
		summaryOverlay = document.createElement("div");
		summaryOverlay.id = "sa-summary-overlay";
		summaryOverlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);font-family:system-ui,-apple-system,sans-serif;";
		const card = document.createElement("div");
		card.style.cssText = "background:#fff;color:#1f2328;border-radius:12px;padding:24px 28px;max-width:520px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.25);position:relative;max-height:70vh;overflow-y:auto;line-height:1.65;font-size:15px;";
		const titleBar = document.createElement("div");
		titleBar.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;";
		const title = document.createElement("strong");
		title.style.cssText = "font-size:17px;color:#0f172a;";
		title.textContent = "📋 Özet";
		const btnGroup = document.createElement("div");
		btnGroup.style.cssText = "display:flex;gap:8px;";
		const copyBtn = document.createElement("button");
		copyBtn.type = "button";
		copyBtn.textContent = "Kopyala";
		copyBtn.style.cssText = "border:1px solid #d1d5db;background:#f9fafb;color:#374151;border-radius:6px;padding:4px 12px;font-size:13px;cursor:pointer;";
		copyBtn.addEventListener("click", () => {
			navigator.clipboard.writeText(summary).then(() => {
				copyBtn.textContent = "Kopyalandı ✓";
				setTimeout(() => {
					copyBtn.textContent = "Kopyala";
				}, 1500);
			});
		});
		const closeBtn = document.createElement("button");
		closeBtn.type = "button";
		closeBtn.textContent = "✕";
		closeBtn.style.cssText = "border:none;background:none;color:#6b7280;font-size:20px;cursor:pointer;padding:0 4px;line-height:1;";
		closeBtn.addEventListener("click", closeSummaryOverlay);
		btnGroup.append(copyBtn, closeBtn);
		titleBar.append(title, btnGroup);
		const body = document.createElement("p");
		body.style.cssText = "margin:0;white-space:pre-wrap;";
		body.textContent = summary;
		card.append(titleBar, body);
		summaryOverlay.appendChild(card);
		summaryOverlay.addEventListener("click", (e) => {
			if (e.target === summaryOverlay) closeSummaryOverlay();
		});
		document.documentElement.appendChild(summaryOverlay);
		const onKey = (e) => {
			if (e.key === "Escape") {
				closeSummaryOverlay();
				window.removeEventListener("keydown", onKey, true);
			}
		};
		window.addEventListener("keydown", onKey, true);
	}
	function closeSummaryOverlay() {
		summaryOverlay?.remove();
		summaryOverlay = null;
	}
	var content_default = defineContentScript({
		matches: ["<all_urls>"],
		main(ctx) {
			ctx.onInvalidated(() => location.reload());
			browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
				if (message.type === "SET_READING_MODE") try {
					sendResponse({ ok: message.enabled ? enableReading(message.theme) : (disableReading(), true) });
				} catch (err) {
					console.error("Okuma modu hatası:", err);
					sendResponse({
						ok: false,
						error: err instanceof Error ? err.message : String(err)
					});
				}
				else if (message.type === "SHOW_SUMMARY") {
					console.log("Sekme Asistanı: SHOW_SUMMARY mesajı alındı.", message.summary);
					showSummaryOverlay(message.summary);
					sendResponse({ ok: true });
				} else if (message.type === "SUMMARIZE_PAGE") {
					console.log("Sekme Asistanı: SUMMARIZE_PAGE mesajı alındı.");
					try {
						const clone = document.cloneNode(true);
						resolveLazyImages(clone);
						const article = new import_readability.Readability(clone).parse();
						if (article && article.textContent) showSummaryOverlay(summarize(article.textContent, 5) || "Bu sayfadan özetlenecek yeterli metin bulunamadı.");
						else showSummaryOverlay("Bu sayfadan içerik çıkarılamadı (belki makale değil veya çok kısa).");
						sendResponse({ ok: true });
					} catch (err) {
						console.error("Sayfa özetleme hatası:", err);
						sendResponse({ ok: false });
					}
				}
			});
			refreshGesturesFlag();
			browser.storage.onChanged.addListener((changes, area) => {
				if (area === "local" && changes.settings) gesturesEnabled = changes.settings.newValue?.gesturesEnabled ?? false;
			});
			window.addEventListener("mousedown", (e) => {
				if (e.button !== 2 || !gesturesEnabled) return;
				gTracking = true;
				gMoved = false;
				gSuppressMenu = false;
				gStartX = e.clientX;
				gStartY = e.clientY;
			}, true);
			window.addEventListener("mousemove", (e) => {
				if (!gTracking) return;
				if (!gMoved && Math.hypot(e.clientX - gStartX, e.clientY - gStartY) > 30) gMoved = true;
				if (gMoved) showTrail(e.clientX, e.clientY);
			}, true);
			window.addEventListener("mouseup", (e) => {
				if (e.button !== 2 || !gTracking) return;
				if (gMoved) {
					gSuppressMenu = true;
					const dir = detectDirection(e.clientX - gStartX, e.clientY - gStartY);
					if (dir) runAction(dir);
				}
				resetGesture();
			}, true);
			window.addEventListener("contextmenu", (e) => {
				if (gSuppressMenu) {
					e.preventDefault();
					e.stopImmediatePropagation();
					gSuppressMenu = false;
					return;
				}
				if (gesturesEnabled && gTracking) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			}, true);
		}
	});
	//#endregion
	//#region node_modules/wxt/dist/utils/internal/logger.mjs
	function print$1(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => print$1(console.debug, ...args),
		log: (...args) => print$1(console.log, ...args),
		warn: (...args) => print$1(console.warn, ...args),
		error: (...args) => print$1(console.error, ...args)
	};
	//#endregion
	//#region node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}
	//#endregion
	//#region node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region node_modules/wxt/dist/utils/content-script-context.mjs
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!this.options?.noScriptStartedPostMessage) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?C:/Users/bayra/OneDrive/Desktop/Yapay Zeka Kodlarım/Tarayıcı Uzantısı/entrypoints/content.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	//#endregion
	return (async () => {
		try {
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJwcmludCIsImxvZ2dlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9kZWZpbmUtY29udGVudC1zY3JpcHQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbW96aWxsYS9yZWFkYWJpbGl0eS9SZWFkYWJpbGl0eS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbW96aWxsYS9yZWFkYWJpbGl0eS9SZWFkYWJpbGl0eS1yZWFkZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Btb3ppbGxhL3JlYWRhYmlsaXR5L2luZGV4LmpzIiwiLi4vLi4vLi4vc2hhcmVkL3RleHRyYW5rLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9pbnRlcm5hbC9sb2dnZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQubWpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vI3JlZ2lvbiBzcmMvdXRpbHMvZGVmaW5lLWNvbnRlbnQtc2NyaXB0LnRzXG5mdW5jdGlvbiBkZWZpbmVDb250ZW50U2NyaXB0KGRlZmluaXRpb24pIHtcblx0cmV0dXJuIGRlZmluaXRpb247XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGRlZmluZUNvbnRlbnRTY3JpcHQgfTtcbiIsIi8vICNyZWdpb24gc25pcHBldFxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkXG4gID8gZ2xvYmFsVGhpcy5icm93c2VyXG4gIDogZ2xvYmFsVGhpcy5jaHJvbWU7XG4vLyAjZW5kcmVnaW9uIHNuaXBwZXRcbiIsImltcG9ydCB7IGJyb3dzZXIgYXMgYnJvd3NlciQxIH0gZnJvbSBcIkB3eHQtZGV2L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvYnJvd3Nlci50c1xuLyoqXG4qIENvbnRhaW5zIHRoZSBgYnJvd3NlcmAgZXhwb3J0IHdoaWNoIHlvdSBzaG91bGQgdXNlIHRvIGFjY2VzcyB0aGUgZXh0ZW5zaW9uXG4qIEFQSXMgaW4geW91ciBwcm9qZWN0OlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBicm93c2VyIH0gZnJvbSAnd3h0L2Jyb3dzZXInO1xuKlxuKiBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuKiAgIC8vIC4uLlxuKiB9KTtcbiogYGBgXG4qXG4qIEBtb2R1bGUgd3h0L2Jyb3dzZXJcbiovXG5jb25zdCBicm93c2VyID0gYnJvd3NlciQxO1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBicm93c2VyIH07XG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDEwIEFyYzkwIEluY1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKlxuICogVGhpcyBjb2RlIGlzIGhlYXZpbHkgYmFzZWQgb24gQXJjOTAncyByZWFkYWJpbGl0eS5qcyAoMS43LjEpIHNjcmlwdFxuICogYXZhaWxhYmxlIGF0OiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvYXJjOTBsYWJzLXJlYWRhYmlsaXR5XG4gKi9cblxuLyoqXG4gKiBQdWJsaWMgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge0hUTUxEb2N1bWVudH0gZG9jICAgICBUaGUgZG9jdW1lbnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgb3B0aW9ucyBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIFJlYWRhYmlsaXR5KGRvYywgb3B0aW9ucykge1xuICAvLyBJbiBzb21lIG9sZGVyIHZlcnNpb25zLCBwZW9wbGUgcGFzc2VkIGEgVVJJIGFzIHRoZSBmaXJzdCBhcmd1bWVudC4gQ29wZTpcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICBkb2MgPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG4gIH0gZWxzZSBpZiAoIWRvYyB8fCAhZG9jLmRvY3VtZW50RWxlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiRmlyc3QgYXJndW1lbnQgdG8gUmVhZGFiaWxpdHkgY29uc3RydWN0b3Igc2hvdWxkIGJlIGEgZG9jdW1lbnQgb2JqZWN0LlwiXG4gICAgKTtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLl9kb2MgPSBkb2M7XG4gIHRoaXMuX2RvY0pTRE9NUGFyc2VyID0gdGhpcy5fZG9jLmZpcnN0Q2hpbGQuX19KU0RPTVBhcnNlcl9fO1xuICB0aGlzLl9hcnRpY2xlVGl0bGUgPSBudWxsO1xuICB0aGlzLl9hcnRpY2xlQnlsaW5lID0gbnVsbDtcbiAgdGhpcy5fYXJ0aWNsZURpciA9IG51bGw7XG4gIHRoaXMuX2FydGljbGVTaXRlTmFtZSA9IG51bGw7XG4gIHRoaXMuX2F0dGVtcHRzID0gW107XG4gIHRoaXMuX21ldGFkYXRhID0ge307XG5cbiAgLy8gQ29uZmlndXJhYmxlIG9wdGlvbnNcbiAgdGhpcy5fZGVidWcgPSAhIW9wdGlvbnMuZGVidWc7XG4gIHRoaXMuX21heEVsZW1zVG9QYXJzZSA9XG4gICAgb3B0aW9ucy5tYXhFbGVtc1RvUGFyc2UgfHwgdGhpcy5ERUZBVUxUX01BWF9FTEVNU19UT19QQVJTRTtcbiAgdGhpcy5fbmJUb3BDYW5kaWRhdGVzID1cbiAgICBvcHRpb25zLm5iVG9wQ2FuZGlkYXRlcyB8fCB0aGlzLkRFRkFVTFRfTl9UT1BfQ0FORElEQVRFUztcbiAgdGhpcy5fY2hhclRocmVzaG9sZCA9IG9wdGlvbnMuY2hhclRocmVzaG9sZCB8fCB0aGlzLkRFRkFVTFRfQ0hBUl9USFJFU0hPTEQ7XG4gIHRoaXMuX2NsYXNzZXNUb1ByZXNlcnZlID0gdGhpcy5DTEFTU0VTX1RPX1BSRVNFUlZFLmNvbmNhdChcbiAgICBvcHRpb25zLmNsYXNzZXNUb1ByZXNlcnZlIHx8IFtdXG4gICk7XG4gIHRoaXMuX2tlZXBDbGFzc2VzID0gISFvcHRpb25zLmtlZXBDbGFzc2VzO1xuICB0aGlzLl9zZXJpYWxpemVyID1cbiAgICBvcHRpb25zLnNlcmlhbGl6ZXIgfHxcbiAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHJldHVybiBlbC5pbm5lckhUTUw7XG4gICAgfTtcbiAgdGhpcy5fZGlzYWJsZUpTT05MRCA9ICEhb3B0aW9ucy5kaXNhYmxlSlNPTkxEO1xuICB0aGlzLl9hbGxvd2VkVmlkZW9SZWdleCA9IG9wdGlvbnMuYWxsb3dlZFZpZGVvUmVnZXggfHwgdGhpcy5SRUdFWFBTLnZpZGVvcztcbiAgdGhpcy5fbGlua0RlbnNpdHlNb2RpZmllciA9IG9wdGlvbnMubGlua0RlbnNpdHlNb2RpZmllciB8fCAwO1xuXG4gIC8vIFN0YXJ0IHdpdGggYWxsIGZsYWdzIHNldFxuICB0aGlzLl9mbGFncyA9XG4gICAgdGhpcy5GTEFHX1NUUklQX1VOTElLRUxZUyB8XG4gICAgdGhpcy5GTEFHX1dFSUdIVF9DTEFTU0VTIHxcbiAgICB0aGlzLkZMQUdfQ0xFQU5fQ09ORElUSU9OQUxMWTtcblxuICAvLyBDb250cm9sIHdoZXRoZXIgbG9nIG1lc3NhZ2VzIGFyZSBzZW50IHRvIHRoZSBjb25zb2xlXG4gIGlmICh0aGlzLl9kZWJ1Zykge1xuICAgIGxldCBsb2dOb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09IG5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHJldHVybiBgJHtub2RlLm5vZGVOYW1lfSAoXCIke25vZGUudGV4dENvbnRlbnR9XCIpYDtcbiAgICAgIH1cbiAgICAgIGxldCBhdHRyUGFpcnMgPSBBcnJheS5mcm9tKG5vZGUuYXR0cmlidXRlcyB8fCBbXSwgZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgcmV0dXJuIGAke2F0dHIubmFtZX09XCIke2F0dHIudmFsdWV9XCJgO1xuICAgICAgfSkuam9pbihcIiBcIik7XG4gICAgICByZXR1cm4gYDwke25vZGUubG9jYWxOYW1lfSAke2F0dHJQYWlyc30+YDtcbiAgICB9O1xuICAgIHRoaXMubG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGxldCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMsIGFyZyA9PiB7XG4gICAgICAgICAgaWYgKGFyZyAmJiBhcmcubm9kZVR5cGUgPT0gdGhpcy5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2dOb2RlKGFyZyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgIH0pO1xuICAgICAgICBhcmdzLnVuc2hpZnQoXCJSZWFkZXI6IChSZWFkYWJpbGl0eSlcIik7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZHVtcCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvKiBnbG9iYWwgZHVtcCAqL1xuICAgICAgICB2YXIgbXNnID0gQXJyYXkucHJvdG90eXBlLm1hcFxuICAgICAgICAgIC5jYWxsKGFyZ3VtZW50cywgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICYmIHgubm9kZU5hbWUgPyBsb2dOb2RlKHgpIDogeDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKFwiIFwiKTtcbiAgICAgICAgZHVtcChcIlJlYWRlcjogKFJlYWRhYmlsaXR5KSBcIiArIG1zZyArIFwiXFxuXCIpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5sb2cgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxufVxuXG5SZWFkYWJpbGl0eS5wcm90b3R5cGUgPSB7XG4gIEZMQUdfU1RSSVBfVU5MSUtFTFlTOiAweDEsXG4gIEZMQUdfV0VJR0hUX0NMQVNTRVM6IDB4MixcbiAgRkxBR19DTEVBTl9DT05ESVRJT05BTExZOiAweDQsXG5cbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvbm9kZVR5cGVcbiAgRUxFTUVOVF9OT0RFOiAxLFxuICBURVhUX05PREU6IDMsXG5cbiAgLy8gTWF4IG51bWJlciBvZiBub2RlcyBzdXBwb3J0ZWQgYnkgdGhpcyBwYXJzZXIuIERlZmF1bHQ6IDAgKG5vIGxpbWl0KVxuICBERUZBVUxUX01BWF9FTEVNU19UT19QQVJTRTogMCxcblxuICAvLyBUaGUgbnVtYmVyIG9mIHRvcCBjYW5kaWRhdGVzIHRvIGNvbnNpZGVyIHdoZW4gYW5hbHlzaW5nIGhvd1xuICAvLyB0aWdodCB0aGUgY29tcGV0aXRpb24gaXMgYW1vbmcgY2FuZGlkYXRlcy5cbiAgREVGQVVMVF9OX1RPUF9DQU5ESURBVEVTOiA1LFxuXG4gIC8vIEVsZW1lbnQgdGFncyB0byBzY29yZSBieSBkZWZhdWx0LlxuICBERUZBVUxUX1RBR1NfVE9fU0NPUkU6IFwic2VjdGlvbixoMixoMyxoNCxoNSxoNixwLHRkLHByZVwiXG4gICAgLnRvVXBwZXJDYXNlKClcbiAgICAuc3BsaXQoXCIsXCIpLFxuXG4gIC8vIFRoZSBkZWZhdWx0IG51bWJlciBvZiBjaGFycyBhbiBhcnRpY2xlIG11c3QgaGF2ZSBpbiBvcmRlciB0byByZXR1cm4gYSByZXN1bHRcbiAgREVGQVVMVF9DSEFSX1RIUkVTSE9MRDogNTAwLFxuXG4gIC8vIEFsbCBvZiB0aGUgcmVndWxhciBleHByZXNzaW9ucyBpbiB1c2Ugd2l0aGluIHJlYWRhYmlsaXR5LlxuICAvLyBEZWZpbmVkIHVwIGhlcmUgc28gd2UgZG9uJ3QgaW5zdGFudGlhdGUgdGhlbSByZXBlYXRlZGx5IGluIGxvb3BzLlxuICBSRUdFWFBTOiB7XG4gICAgLy8gTk9URTogVGhlc2UgdHdvIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYXJlIGR1cGxpY2F0ZWQgaW5cbiAgICAvLyBSZWFkYWJpbGl0eS1yZWFkZXJhYmxlLmpzLiBQbGVhc2Uga2VlcCBib3RoIGNvcGllcyBpbiBzeW5jLlxuICAgIHVubGlrZWx5Q2FuZGlkYXRlczpcbiAgICAgIC8tYWQtfGFpMmh0bWx8YmFubmVyfGJyZWFkY3J1bWJzfGNvbWJ4fGNvbW1lbnR8Y29tbXVuaXR5fGNvdmVyLXdyYXB8ZGlzcXVzfGV4dHJhfGZvb3RlcnxnZHByfGhlYWRlcnxsZWdlbmRzfG1lbnV8cmVsYXRlZHxyZW1hcmt8cmVwbGllc3xyc3N8c2hvdXRib3h8c2lkZWJhcnxza3lzY3JhcGVyfHNvY2lhbHxzcG9uc29yfHN1cHBsZW1lbnRhbHxhZC1icmVha3xhZ2VnYXRlfHBhZ2luYXRpb258cGFnZXJ8cG9wdXB8eW9tLXJlbW90ZS9pLFxuICAgIG9rTWF5YmVJdHNBQ2FuZGlkYXRlOiAvYW5kfGFydGljbGV8Ym9keXxjb2x1bW58Y29udGVudHxtYWlufHNoYWRvdy9pLFxuXG4gICAgcG9zaXRpdmU6XG4gICAgICAvYXJ0aWNsZXxib2R5fGNvbnRlbnR8ZW50cnl8aGVudHJ5fGgtZW50cnl8bWFpbnxwYWdlfHBhZ2luYXRpb258cG9zdHx0ZXh0fGJsb2d8c3RvcnkvaSxcbiAgICBuZWdhdGl2ZTpcbiAgICAgIC8tYWQtfGhpZGRlbnxeaGlkJHwgaGlkJHwgaGlkIHxeaGlkIHxiYW5uZXJ8Y29tYnh8Y29tbWVudHxjb20tfGNvbnRhY3R8Zm9vdGVyfGdkcHJ8bWFzdGhlYWR8bWVkaWF8bWV0YXxvdXRicmFpbnxwcm9tb3xyZWxhdGVkfHNjcm9sbHxzaGFyZXxzaG91dGJveHxzaWRlYmFyfHNreXNjcmFwZXJ8c3BvbnNvcnxzaG9wcGluZ3x0YWdzfHdpZGdldC9pLFxuICAgIGV4dHJhbmVvdXM6XG4gICAgICAvcHJpbnR8YXJjaGl2ZXxjb21tZW50fGRpc2N1c3N8ZVtcXC1dP21haWx8c2hhcmV8cmVwbHl8YWxsfGxvZ2lufHNpZ258c2luZ2xlfHV0aWxpdHkvaSxcbiAgICBieWxpbmU6IC9ieWxpbmV8YXV0aG9yfGRhdGVsaW5lfHdyaXR0ZW5ieXxwLWF1dGhvci9pLFxuICAgIHJlcGxhY2VGb250czogLzwoXFwvPylmb250W14+XSo+L2dpLFxuICAgIG5vcm1hbGl6ZTogL1xcc3syLH0vZyxcbiAgICB2aWRlb3M6XG4gICAgICAvXFwvXFwvKHd3d1xcLik/KChkYWlseW1vdGlvbnx5b3V0dWJlfHlvdXR1YmUtbm9jb29raWV8cGxheWVyXFwudmltZW98dlxcLnFxKVxcLmNvbXwoYXJjaGl2ZXx1cGxvYWRcXC53aWtpbWVkaWEpXFwub3JnfHBsYXllclxcLnR3aXRjaFxcLnR2KS9pLFxuICAgIHNoYXJlRWxlbWVudHM6IC8oXFxifF8pKHNoYXJlfHNoYXJlZGFkZHkpKFxcYnxfKS9pLFxuICAgIG5leHRMaW5rOiAvKG5leHR8d2VpdGVyfGNvbnRpbnVlfD4oW15cXHxdfCQpfMK7KFteXFx8XXwkKSkvaSxcbiAgICBwcmV2TGluazogLyhwcmV2fGVhcmx8b2xkfG5ld3w8fMKrKS9pLFxuICAgIHRva2VuaXplOiAvXFxXKy9nLFxuICAgIHdoaXRlc3BhY2U6IC9eXFxzKiQvLFxuICAgIGhhc0NvbnRlbnQ6IC9cXFMkLyxcbiAgICBoYXNoVXJsOiAvXiMuKy8sXG4gICAgc3Jjc2V0VXJsOiAvKFxcUyspKFxccytbXFxkLl0rW3h3XSk/KFxccyooPzosfCQpKS9nLFxuICAgIGI2NERhdGFVcmw6IC9eZGF0YTpcXHMqKFteXFxzOyxdKylcXHMqO1xccypiYXNlNjRcXHMqLC9pLFxuICAgIC8vIENvbW1hcyBhcyB1c2VkIGluIExhdGluLCBTaW5kaGksIENoaW5lc2UgYW5kIHZhcmlvdXMgb3RoZXIgc2NyaXB0cy5cbiAgICAvLyBzZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbW1hI0NvbW1hX3ZhcmlhbnRzXG4gICAgY29tbWFzOiAvXFx1MDAyQ3xcXHUwNjBDfFxcdUZFNTB8XFx1RkUxMHxcXHVGRTExfFxcdTJFNDF8XFx1MkUzNHxcXHUyRTMyfFxcdUZGMEMvZyxcbiAgICAvLyBTZWU6IGh0dHBzOi8vc2NoZW1hLm9yZy9BcnRpY2xlXG4gICAganNvbkxkQXJ0aWNsZVR5cGVzOlxuICAgICAgL15BcnRpY2xlfEFkdmVydGlzZXJDb250ZW50QXJ0aWNsZXxOZXdzQXJ0aWNsZXxBbmFseXNpc05ld3NBcnRpY2xlfEFza1B1YmxpY05ld3NBcnRpY2xlfEJhY2tncm91bmROZXdzQXJ0aWNsZXxPcGluaW9uTmV3c0FydGljbGV8UmVwb3J0YWdlTmV3c0FydGljbGV8UmV2aWV3TmV3c0FydGljbGV8UmVwb3J0fFNhdGlyaWNhbEFydGljbGV8U2Nob2xhcmx5QXJ0aWNsZXxNZWRpY2FsU2Nob2xhcmx5QXJ0aWNsZXxTb2NpYWxNZWRpYVBvc3Rpbmd8QmxvZ1Bvc3Rpbmd8TGl2ZUJsb2dQb3N0aW5nfERpc2N1c3Npb25Gb3J1bVBvc3Rpbmd8VGVjaEFydGljbGV8QVBJUmVmZXJlbmNlJC8sXG4gICAgLy8gdXNlZCB0byBzZWUgaWYgYSBub2RlJ3MgY29udGVudCBtYXRjaGVzIHdvcmRzIGNvbW1vbmx5IHVzZWQgZm9yIGFkIGJsb2NrcyBvciBsb2FkaW5nIGluZGljYXRvcnNcbiAgICBhZFdvcmRzOlxuICAgICAgL14oYWQodmVydGlzaW5nfHZlcnRpc2VtZW50KT98cHViKGxpY2l0w6kpP3x3ZXJiKHVuZyk/fOW5v+WRinzQoNC10LrQu9Cw0LzQsHxBbnVuY2lvKSQvaXUsXG4gICAgbG9hZGluZ1dvcmRzOlxuICAgICAgL14oKGxvYWRpbmd85q2j5Zyo5Yqg6L29fNCX0LDQs9GA0YPQt9C60LB8Y2hhcmdlbWVudHxjYXJnYW5kbyko4oCmfFxcLlxcLlxcLik/KSQvaXUsXG4gIH0sXG5cbiAgVU5MSUtFTFlfUk9MRVM6IFtcbiAgICBcIm1lbnVcIixcbiAgICBcIm1lbnViYXJcIixcbiAgICBcImNvbXBsZW1lbnRhcnlcIixcbiAgICBcIm5hdmlnYXRpb25cIixcbiAgICBcImFsZXJ0XCIsXG4gICAgXCJhbGVydGRpYWxvZ1wiLFxuICAgIFwiZGlhbG9nXCIsXG4gIF0sXG5cbiAgRElWX1RPX1BfRUxFTVM6IG5ldyBTZXQoW1xuICAgIFwiQkxPQ0tRVU9URVwiLFxuICAgIFwiRExcIixcbiAgICBcIkRJVlwiLFxuICAgIFwiSU1HXCIsXG4gICAgXCJPTFwiLFxuICAgIFwiUFwiLFxuICAgIFwiUFJFXCIsXG4gICAgXCJUQUJMRVwiLFxuICAgIFwiVUxcIixcbiAgXSksXG5cbiAgQUxURVJfVE9fRElWX0VYQ0VQVElPTlM6IFtcIkRJVlwiLCBcIkFSVElDTEVcIiwgXCJTRUNUSU9OXCIsIFwiUFwiLCBcIk9MXCIsIFwiVUxcIl0sXG5cbiAgUFJFU0VOVEFUSU9OQUxfQVRUUklCVVRFUzogW1xuICAgIFwiYWxpZ25cIixcbiAgICBcImJhY2tncm91bmRcIixcbiAgICBcImJnY29sb3JcIixcbiAgICBcImJvcmRlclwiLFxuICAgIFwiY2VsbHBhZGRpbmdcIixcbiAgICBcImNlbGxzcGFjaW5nXCIsXG4gICAgXCJmcmFtZVwiLFxuICAgIFwiaHNwYWNlXCIsXG4gICAgXCJydWxlc1wiLFxuICAgIFwic3R5bGVcIixcbiAgICBcInZhbGlnblwiLFxuICAgIFwidnNwYWNlXCIsXG4gIF0sXG5cbiAgREVQUkVDQVRFRF9TSVpFX0FUVFJJQlVURV9FTEVNUzogW1wiVEFCTEVcIiwgXCJUSFwiLCBcIlREXCIsIFwiSFJcIiwgXCJQUkVcIl0sXG5cbiAgLy8gVGhlIGNvbW1lbnRlZCBvdXQgZWxlbWVudHMgcXVhbGlmeSBhcyBwaHJhc2luZyBjb250ZW50IGJ1dCB0ZW5kIHRvIGJlXG4gIC8vIHJlbW92ZWQgYnkgcmVhZGFiaWxpdHkgd2hlbiBwdXQgaW50byBwYXJhZ3JhcGhzLCBzbyB3ZSBpZ25vcmUgdGhlbSBoZXJlLlxuICBQSFJBU0lOR19FTEVNUzogW1xuICAgIC8vIFwiQ0FOVkFTXCIsIFwiSUZSQU1FXCIsIFwiU1ZHXCIsIFwiVklERU9cIixcbiAgICBcIkFCQlJcIixcbiAgICBcIkFVRElPXCIsXG4gICAgXCJCXCIsXG4gICAgXCJCRE9cIixcbiAgICBcIkJSXCIsXG4gICAgXCJCVVRUT05cIixcbiAgICBcIkNJVEVcIixcbiAgICBcIkNPREVcIixcbiAgICBcIkRBVEFcIixcbiAgICBcIkRBVEFMSVNUXCIsXG4gICAgXCJERk5cIixcbiAgICBcIkVNXCIsXG4gICAgXCJFTUJFRFwiLFxuICAgIFwiSVwiLFxuICAgIFwiSU1HXCIsXG4gICAgXCJJTlBVVFwiLFxuICAgIFwiS0JEXCIsXG4gICAgXCJMQUJFTFwiLFxuICAgIFwiTUFSS1wiLFxuICAgIFwiTUFUSFwiLFxuICAgIFwiTUVURVJcIixcbiAgICBcIk5PU0NSSVBUXCIsXG4gICAgXCJPQkpFQ1RcIixcbiAgICBcIk9VVFBVVFwiLFxuICAgIFwiUFJPR1JFU1NcIixcbiAgICBcIlFcIixcbiAgICBcIlJVQllcIixcbiAgICBcIlNBTVBcIixcbiAgICBcIlNDUklQVFwiLFxuICAgIFwiU0VMRUNUXCIsXG4gICAgXCJTTUFMTFwiLFxuICAgIFwiU1BBTlwiLFxuICAgIFwiU1RST05HXCIsXG4gICAgXCJTVUJcIixcbiAgICBcIlNVUFwiLFxuICAgIFwiVEVYVEFSRUFcIixcbiAgICBcIlRJTUVcIixcbiAgICBcIlZBUlwiLFxuICAgIFwiV0JSXCIsXG4gIF0sXG5cbiAgLy8gVGhlc2UgYXJlIHRoZSBjbGFzc2VzIHRoYXQgcmVhZGFiaWxpdHkgc2V0cyBpdHNlbGYuXG4gIENMQVNTRVNfVE9fUFJFU0VSVkU6IFtcInBhZ2VcIl0sXG5cbiAgLy8gVGhlc2UgYXJlIHRoZSBsaXN0IG9mIEhUTUwgZW50aXRpZXMgdGhhdCBuZWVkIHRvIGJlIGVzY2FwZWQuXG4gIEhUTUxfRVNDQVBFX01BUDoge1xuICAgIGx0OiBcIjxcIixcbiAgICBndDogXCI+XCIsXG4gICAgYW1wOiBcIiZcIixcbiAgICBxdW90OiAnXCInLFxuICAgIGFwb3M6IFwiJ1wiLFxuICB9LFxuXG4gIC8qKlxuICAgKiBSdW4gYW55IHBvc3QtcHJvY2VzcyBtb2RpZmljYXRpb25zIHRvIGFydGljbGUgY29udGVudCBhcyBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKiovXG4gIF9wb3N0UHJvY2Vzc0NvbnRlbnQoYXJ0aWNsZUNvbnRlbnQpIHtcbiAgICAvLyBSZWFkYWJpbGl0eSBjYW5ub3Qgb3BlbiByZWxhdGl2ZSB1cmlzIHNvIHdlIGNvbnZlcnQgdGhlbSB0byBhYnNvbHV0ZSB1cmlzLlxuICAgIHRoaXMuX2ZpeFJlbGF0aXZlVXJpcyhhcnRpY2xlQ29udGVudCk7XG5cbiAgICB0aGlzLl9zaW1wbGlmeU5lc3RlZEVsZW1lbnRzKGFydGljbGVDb250ZW50KTtcblxuICAgIGlmICghdGhpcy5fa2VlcENsYXNzZXMpIHtcbiAgICAgIC8vIFJlbW92ZSBjbGFzc2VzLlxuICAgICAgdGhpcy5fY2xlYW5DbGFzc2VzKGFydGljbGVDb250ZW50KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgYSBOb2RlTGlzdCwgY2FsbHMgYGZpbHRlckZuYCBmb3IgZWFjaCBub2RlIGFuZCByZW1vdmVzIG5vZGVcbiAgICogaWYgZnVuY3Rpb24gcmV0dXJuZWQgYHRydWVgLlxuICAgKlxuICAgKiBJZiBmdW5jdGlvbiBpcyBub3QgcGFzc2VkLCByZW1vdmVzIGFsbCB0aGUgbm9kZXMgaW4gbm9kZSBsaXN0LlxuICAgKlxuICAgKiBAcGFyYW0gTm9kZUxpc3Qgbm9kZUxpc3QgVGhlIG5vZGVzIHRvIG9wZXJhdGUgb25cbiAgICogQHBhcmFtIEZ1bmN0aW9uIGZpbHRlckZuIHRoZSBmdW5jdGlvbiB0byB1c2UgYXMgYSBmaWx0ZXJcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfcmVtb3ZlTm9kZXMobm9kZUxpc3QsIGZpbHRlckZuKSB7XG4gICAgLy8gQXZvaWQgZXZlciBvcGVyYXRpbmcgb24gbGl2ZSBub2RlIGxpc3RzLlxuICAgIGlmICh0aGlzLl9kb2NKU0RPTVBhcnNlciAmJiBub2RlTGlzdC5faXNMaXZlTm9kZUxpc3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRvIG5vdCBwYXNzIGxpdmUgbm9kZSBsaXN0cyB0byBfcmVtb3ZlTm9kZXNcIik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBub2RlTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIG5vZGUgPSBub2RlTGlzdFtpXTtcbiAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgaWYgKCFmaWx0ZXJGbiB8fCBmaWx0ZXJGbi5jYWxsKHRoaXMsIG5vZGUsIGksIG5vZGVMaXN0KSkge1xuICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgYSBOb2RlTGlzdCwgYW5kIGNhbGxzIF9zZXROb2RlVGFnIGZvciBlYWNoIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSBOb2RlTGlzdCBub2RlTGlzdCBUaGUgbm9kZXMgdG8gb3BlcmF0ZSBvblxuICAgKiBAcGFyYW0gU3RyaW5nIG5ld1RhZ05hbWUgdGhlIG5ldyB0YWcgbmFtZSB0byB1c2VcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfcmVwbGFjZU5vZGVUYWdzKG5vZGVMaXN0LCBuZXdUYWdOYW1lKSB7XG4gICAgLy8gQXZvaWQgZXZlciBvcGVyYXRpbmcgb24gbGl2ZSBub2RlIGxpc3RzLlxuICAgIGlmICh0aGlzLl9kb2NKU0RPTVBhcnNlciAmJiBub2RlTGlzdC5faXNMaXZlTm9kZUxpc3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRvIG5vdCBwYXNzIGxpdmUgbm9kZSBsaXN0cyB0byBfcmVwbGFjZU5vZGVUYWdzXCIpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZUxpc3QpIHtcbiAgICAgIHRoaXMuX3NldE5vZGVUYWcobm9kZSwgbmV3VGFnTmFtZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYSBOb2RlTGlzdCwgd2hpY2ggZG9lc24ndCBuYXRpdmVseSBmdWxseSBpbXBsZW1lbnQgdGhlIEFycmF5XG4gICAqIGludGVyZmFjZS5cbiAgICpcbiAgICogRm9yIGNvbnZlbmllbmNlLCB0aGUgY3VycmVudCBvYmplY3QgY29udGV4dCBpcyBhcHBsaWVkIHRvIHRoZSBwcm92aWRlZFxuICAgKiBpdGVyYXRlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIE5vZGVMaXN0IG5vZGVMaXN0IFRoZSBOb2RlTGlzdC5cbiAgICogQHBhcmFtICBGdW5jdGlvbiBmbiAgICAgICBUaGUgaXRlcmF0ZSBmdW5jdGlvbi5cbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfZm9yRWFjaE5vZGUobm9kZUxpc3QsIGZuKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChub2RlTGlzdCwgZm4sIHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYSBOb2RlTGlzdCwgYW5kIHJldHVybiB0aGUgZmlyc3Qgbm9kZSB0aGF0IHBhc3Nlc1xuICAgKiB0aGUgc3VwcGxpZWQgdGVzdCBmdW5jdGlvblxuICAgKlxuICAgKiBGb3IgY29udmVuaWVuY2UsIHRoZSBjdXJyZW50IG9iamVjdCBjb250ZXh0IGlzIGFwcGxpZWQgdG8gdGhlIHByb3ZpZGVkXG4gICAqIHRlc3QgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSAgTm9kZUxpc3Qgbm9kZUxpc3QgVGhlIE5vZGVMaXN0LlxuICAgKiBAcGFyYW0gIEZ1bmN0aW9uIGZuICAgICAgIFRoZSB0ZXN0IGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIF9maW5kTm9kZShub2RlTGlzdCwgZm4pIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbmQuY2FsbChub2RlTGlzdCwgZm4sIHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYSBOb2RlTGlzdCwgcmV0dXJuIHRydWUgaWYgYW55IG9mIHRoZSBwcm92aWRlZCBpdGVyYXRlXG4gICAqIGZ1bmN0aW9uIGNhbGxzIHJldHVybnMgdHJ1ZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBGb3IgY29udmVuaWVuY2UsIHRoZSBjdXJyZW50IG9iamVjdCBjb250ZXh0IGlzIGFwcGxpZWQgdG8gdGhlXG4gICAqIHByb3ZpZGVkIGl0ZXJhdGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSAgTm9kZUxpc3Qgbm9kZUxpc3QgVGhlIE5vZGVMaXN0LlxuICAgKiBAcGFyYW0gIEZ1bmN0aW9uIGZuICAgICAgIFRoZSBpdGVyYXRlIGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIF9zb21lTm9kZShub2RlTGlzdCwgZm4pIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNvbWUuY2FsbChub2RlTGlzdCwgZm4sIHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYSBOb2RlTGlzdCwgcmV0dXJuIHRydWUgaWYgYWxsIG9mIHRoZSBwcm92aWRlZCBpdGVyYXRlXG4gICAqIGZ1bmN0aW9uIGNhbGxzIHJldHVybiB0cnVlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEZvciBjb252ZW5pZW5jZSwgdGhlIGN1cnJlbnQgb2JqZWN0IGNvbnRleHQgaXMgYXBwbGllZCB0byB0aGVcbiAgICogcHJvdmlkZWQgaXRlcmF0ZSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICBOb2RlTGlzdCBub2RlTGlzdCBUaGUgTm9kZUxpc3QuXG4gICAqIEBwYXJhbSAgRnVuY3Rpb24gZm4gICAgICAgVGhlIGl0ZXJhdGUgZnVuY3Rpb24uXG4gICAqIEByZXR1cm4gQm9vbGVhblxuICAgKi9cbiAgX2V2ZXJ5Tm9kZShub2RlTGlzdCwgZm4pIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmV2ZXJ5LmNhbGwobm9kZUxpc3QsIGZuLCB0aGlzKTtcbiAgfSxcblxuICBfZ2V0QWxsTm9kZXNXaXRoVGFnKG5vZGUsIHRhZ05hbWVzKSB7XG4gICAgaWYgKG5vZGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvckFsbCh0YWdOYW1lcy5qb2luKFwiLFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBbXS5jb25jYXQuYXBwbHkoXG4gICAgICBbXSxcbiAgICAgIHRhZ05hbWVzLm1hcChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpO1xuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiBBcnJheS5mcm9tKGNvbGxlY3Rpb24pO1xuICAgICAgfSlcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBjbGFzcz1cIlwiIGF0dHJpYnV0ZSBmcm9tIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIGdpdmVuXG4gICAqIHN1YnRyZWUsIGV4Y2VwdCB0aG9zZSB0aGF0IG1hdGNoIENMQVNTRVNfVE9fUFJFU0VSVkUgYW5kXG4gICAqIHRoZSBjbGFzc2VzVG9QcmVzZXJ2ZSBhcnJheSBmcm9tIHRoZSBvcHRpb25zIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfY2xlYW5DbGFzc2VzKG5vZGUpIHtcbiAgICB2YXIgY2xhc3Nlc1RvUHJlc2VydmUgPSB0aGlzLl9jbGFzc2VzVG9QcmVzZXJ2ZTtcbiAgICB2YXIgY2xhc3NOYW1lID0gKG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcbiAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAuZmlsdGVyKGNscyA9PiBjbGFzc2VzVG9QcmVzZXJ2ZS5pbmNsdWRlcyhjbHMpKVxuICAgICAgLmpvaW4oXCIgXCIpO1xuXG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgIH1cblxuICAgIGZvciAobm9kZSA9IG5vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7IG5vZGU7IG5vZGUgPSBub2RlLm5leHRFbGVtZW50U2libGluZykge1xuICAgICAgdGhpcy5fY2xlYW5DbGFzc2VzKG5vZGUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVGVzdHMgd2hldGhlciBhIHN0cmluZyBpcyBhIFVSTCBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB0ZXN0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgc3RyIGlzIGEgVVJMLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIF9pc1VybChzdHIpIHtcbiAgICB0cnkge1xuICAgICAgbmV3IFVSTChzdHIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ29udmVydHMgZWFjaCA8YT4gYW5kIDxpbWc+IHVyaSBpbiB0aGUgZ2l2ZW4gZWxlbWVudCB0byBhbiBhYnNvbHV0ZSBVUkksXG4gICAqIGlnbm9yaW5nICNyZWYgVVJJcy5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBfZml4UmVsYXRpdmVVcmlzKGFydGljbGVDb250ZW50KSB7XG4gICAgdmFyIGJhc2VVUkkgPSB0aGlzLl9kb2MuYmFzZVVSSTtcbiAgICB2YXIgZG9jdW1lbnRVUkkgPSB0aGlzLl9kb2MuZG9jdW1lbnRVUkk7XG4gICAgZnVuY3Rpb24gdG9BYnNvbHV0ZVVSSSh1cmkpIHtcbiAgICAgIC8vIExlYXZlIGhhc2ggbGlua3MgYWxvbmUgaWYgdGhlIGJhc2UgVVJJIG1hdGNoZXMgdGhlIGRvY3VtZW50IFVSSTpcbiAgICAgIGlmIChiYXNlVVJJID09IGRvY3VtZW50VVJJICYmIHVyaS5jaGFyQXQoMCkgPT0gXCIjXCIpIHtcbiAgICAgICAgcmV0dXJuIHVyaTtcbiAgICAgIH1cblxuICAgICAgLy8gT3RoZXJ3aXNlLCByZXNvbHZlIGFnYWluc3QgYmFzZSBVUkk6XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gbmV3IFVSTCh1cmksIGJhc2VVUkkpLmhyZWY7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAvLyBTb21ldGhpbmcgd2VudCB3cm9uZywganVzdCByZXR1cm4gdGhlIG9yaWdpbmFsOlxuICAgICAgfVxuICAgICAgcmV0dXJuIHVyaTtcbiAgICB9XG5cbiAgICB2YXIgbGlua3MgPSB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoYXJ0aWNsZUNvbnRlbnQsIFtcImFcIl0pO1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKGxpbmtzLCBmdW5jdGlvbiAobGluaykge1xuICAgICAgdmFyIGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICBpZiAoaHJlZikge1xuICAgICAgICAvLyBSZW1vdmUgbGlua3Mgd2l0aCBqYXZhc2NyaXB0OiBVUklzLCBzaW5jZVxuICAgICAgICAvLyB0aGV5IHdvbid0IHdvcmsgYWZ0ZXIgc2NyaXB0cyBoYXZlIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYWdlLlxuICAgICAgICBpZiAoaHJlZi5pbmRleE9mKFwiamF2YXNjcmlwdDpcIikgPT09IDApIHtcbiAgICAgICAgICAvLyBpZiB0aGUgbGluayBvbmx5IGNvbnRhaW5zIHNpbXBsZSB0ZXh0IGNvbnRlbnQsIGl0IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSB0ZXh0IG5vZGVcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBsaW5rLmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICBsaW5rLmNoaWxkTm9kZXNbMF0ubm9kZVR5cGUgPT09IHRoaXMuVEVYVF9OT0RFXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuX2RvYy5jcmVhdGVUZXh0Tm9kZShsaW5rLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgIGxpbmsucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodGV4dCwgbGluayk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBsaW5rIGhhcyBtdWx0aXBsZSBjaGlsZHJlbiwgdGhleSBzaG91bGQgYWxsIGJlIHByZXNlcnZlZFxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2RvYy5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHdoaWxlIChsaW5rLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmsuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5rLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNvbnRhaW5lciwgbGluayk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCB0b0Fic29sdXRlVVJJKGhyZWYpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIG1lZGlhcyA9IHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhhcnRpY2xlQ29udGVudCwgW1xuICAgICAgXCJpbWdcIixcbiAgICAgIFwicGljdHVyZVwiLFxuICAgICAgXCJmaWd1cmVcIixcbiAgICAgIFwidmlkZW9cIixcbiAgICAgIFwiYXVkaW9cIixcbiAgICAgIFwic291cmNlXCIsXG4gICAgXSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoTm9kZShtZWRpYXMsIGZ1bmN0aW9uIChtZWRpYSkge1xuICAgICAgdmFyIHNyYyA9IG1lZGlhLmdldEF0dHJpYnV0ZShcInNyY1wiKTtcbiAgICAgIHZhciBwb3N0ZXIgPSBtZWRpYS5nZXRBdHRyaWJ1dGUoXCJwb3N0ZXJcIik7XG4gICAgICB2YXIgc3Jjc2V0ID0gbWVkaWEuZ2V0QXR0cmlidXRlKFwic3Jjc2V0XCIpO1xuXG4gICAgICBpZiAoc3JjKSB7XG4gICAgICAgIG1lZGlhLnNldEF0dHJpYnV0ZShcInNyY1wiLCB0b0Fic29sdXRlVVJJKHNyYykpO1xuICAgICAgfVxuXG4gICAgICBpZiAocG9zdGVyKSB7XG4gICAgICAgIG1lZGlhLnNldEF0dHJpYnV0ZShcInBvc3RlclwiLCB0b0Fic29sdXRlVVJJKHBvc3RlcikpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Jjc2V0KSB7XG4gICAgICAgIHZhciBuZXdTcmNzZXQgPSBzcmNzZXQucmVwbGFjZShcbiAgICAgICAgICB0aGlzLlJFR0VYUFMuc3Jjc2V0VXJsLFxuICAgICAgICAgIGZ1bmN0aW9uIChfLCBwMSwgcDIsIHAzKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9BYnNvbHV0ZVVSSShwMSkgKyAocDIgfHwgXCJcIikgKyBwMztcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgbWVkaWEuc2V0QXR0cmlidXRlKFwic3Jjc2V0XCIsIG5ld1NyY3NldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3NpbXBsaWZ5TmVzdGVkRWxlbWVudHMoYXJ0aWNsZUNvbnRlbnQpIHtcbiAgICB2YXIgbm9kZSA9IGFydGljbGVDb250ZW50O1xuXG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlICYmXG4gICAgICAgIFtcIkRJVlwiLCBcIlNFQ1RJT05cIl0uaW5jbHVkZXMobm9kZS50YWdOYW1lKSAmJlxuICAgICAgICAhKG5vZGUuaWQgJiYgbm9kZS5pZC5zdGFydHNXaXRoKFwicmVhZGFiaWxpdHlcIikpXG4gICAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzRWxlbWVudFdpdGhvdXRDb250ZW50KG5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IHRoaXMuX3JlbW92ZUFuZEdldE5leHQobm9kZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgdGhpcy5faGFzU2luZ2xlVGFnSW5zaWRlRWxlbWVudChub2RlLCBcIkRJVlwiKSB8fFxuICAgICAgICAgIHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQobm9kZSwgXCJTRUNUSU9OXCIpXG4gICAgICAgICkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZU5vZGUobm9kZS5hdHRyaWJ1dGVzW2ldLmNsb25lTm9kZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjaGlsZCwgbm9kZSk7XG4gICAgICAgICAgbm9kZSA9IGNoaWxkO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5vZGUgPSB0aGlzLl9nZXROZXh0Tm9kZShub2RlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYXJ0aWNsZSB0aXRsZSBhcyBhbiBIMS5cbiAgICpcbiAgICogQHJldHVybiBzdHJpbmdcbiAgICoqL1xuICBfZ2V0QXJ0aWNsZVRpdGxlKCkge1xuICAgIHZhciBkb2MgPSB0aGlzLl9kb2M7XG4gICAgdmFyIGN1clRpdGxlID0gXCJcIjtcbiAgICB2YXIgb3JpZ1RpdGxlID0gXCJcIjtcblxuICAgIHRyeSB7XG4gICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZSA9IGRvYy50aXRsZS50cmltKCk7XG5cbiAgICAgIC8vIElmIHRoZXkgaGFkIGFuIGVsZW1lbnQgd2l0aCBpZCBcInRpdGxlXCIgaW4gdGhlaXIgSFRNTFxuICAgICAgaWYgKHR5cGVvZiBjdXJUaXRsZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZSA9IHRoaXMuX2dldElubmVyVGV4dChcbiAgICAgICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0aXRsZVwiKVswXVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8qIGlnbm9yZSBleGNlcHRpb25zIHNldHRpbmcgdGhlIHRpdGxlLiAqL1xuICAgIH1cblxuICAgIHZhciB0aXRsZUhhZEhpZXJhcmNoaWNhbFNlcGFyYXRvcnMgPSBmYWxzZTtcbiAgICBmdW5jdGlvbiB3b3JkQ291bnQoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnNwbGl0KC9cXHMrLykubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlJ3MgYSBzZXBhcmF0b3IgaW4gdGhlIHRpdGxlLCBmaXJzdCByZW1vdmUgdGhlIGZpbmFsIHBhcnRcbiAgICBpZiAoLyBbXFx8XFwtXFxcXFxcLz7Cu10gLy50ZXN0KGN1clRpdGxlKSkge1xuICAgICAgdGl0bGVIYWRIaWVyYXJjaGljYWxTZXBhcmF0b3JzID0gLyBbXFxcXFxcLz7Cu10gLy50ZXN0KGN1clRpdGxlKTtcbiAgICAgIGxldCBhbGxTZXBhcmF0b3JzID0gQXJyYXkuZnJvbShvcmlnVGl0bGUubWF0Y2hBbGwoLyBbXFx8XFwtXFxcXFxcLz7Cu10gL2dpKSk7XG4gICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZS5zdWJzdHJpbmcoMCwgYWxsU2VwYXJhdG9ycy5wb3AoKS5pbmRleCk7XG5cbiAgICAgIC8vIElmIHRoZSByZXN1bHRpbmcgdGl0bGUgaXMgdG9vIHNob3J0LCByZW1vdmUgdGhlIGZpcnN0IHBhcnQgaW5zdGVhZDpcbiAgICAgIGlmICh3b3JkQ291bnQoY3VyVGl0bGUpIDwgMykge1xuICAgICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZS5yZXBsYWNlKC9eW15cXHxcXC1cXFxcXFwvPsK7XSpbXFx8XFwtXFxcXFxcLz7Cu10vZ2ksIFwiXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY3VyVGl0bGUuaW5jbHVkZXMoXCI6IFwiKSkge1xuICAgICAgLy8gQ2hlY2sgaWYgd2UgaGF2ZSBhbiBoZWFkaW5nIGNvbnRhaW5pbmcgdGhpcyBleGFjdCBzdHJpbmcsIHNvIHdlXG4gICAgICAvLyBjb3VsZCBhc3N1bWUgaXQncyB0aGUgZnVsbCB0aXRsZS5cbiAgICAgIHZhciBoZWFkaW5ncyA9IHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhkb2MsIFtcImgxXCIsIFwiaDJcIl0pO1xuICAgICAgdmFyIHRyaW1tZWRUaXRsZSA9IGN1clRpdGxlLnRyaW0oKTtcbiAgICAgIHZhciBtYXRjaCA9IHRoaXMuX3NvbWVOb2RlKGhlYWRpbmdzLCBmdW5jdGlvbiAoaGVhZGluZykge1xuICAgICAgICByZXR1cm4gaGVhZGluZy50ZXh0Q29udGVudC50cmltKCkgPT09IHRyaW1tZWRUaXRsZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiB3ZSBkb24ndCwgbGV0J3MgZXh0cmFjdCB0aGUgdGl0bGUgb3V0IG9mIHRoZSBvcmlnaW5hbCB0aXRsZSBzdHJpbmcuXG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIGN1clRpdGxlID0gb3JpZ1RpdGxlLnN1YnN0cmluZyhvcmlnVGl0bGUubGFzdEluZGV4T2YoXCI6XCIpICsgMSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHRpdGxlIGlzIG5vdyB0b28gc2hvcnQsIHRyeSB0aGUgZmlyc3QgY29sb24gaW5zdGVhZDpcbiAgICAgICAgaWYgKHdvcmRDb3VudChjdXJUaXRsZSkgPCAzKSB7XG4gICAgICAgICAgY3VyVGl0bGUgPSBvcmlnVGl0bGUuc3Vic3RyaW5nKG9yaWdUaXRsZS5pbmRleE9mKFwiOlwiKSArIDEpO1xuICAgICAgICAgIC8vIEJ1dCBpZiB3ZSBoYXZlIHRvbyBtYW55IHdvcmRzIGJlZm9yZSB0aGUgY29sb24gdGhlcmUncyBzb21ldGhpbmcgd2VpcmRcbiAgICAgICAgICAvLyB3aXRoIHRoZSB0aXRsZXMgYW5kIHRoZSBIIHRhZ3Mgc28gbGV0J3MganVzdCB1c2UgdGhlIG9yaWdpbmFsIHRpdGxlIGluc3RlYWRcbiAgICAgICAgfSBlbHNlIGlmICh3b3JkQ291bnQob3JpZ1RpdGxlLnN1YnN0cigwLCBvcmlnVGl0bGUuaW5kZXhPZihcIjpcIikpKSA+IDUpIHtcbiAgICAgICAgICBjdXJUaXRsZSA9IG9yaWdUaXRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY3VyVGl0bGUubGVuZ3RoID4gMTUwIHx8IGN1clRpdGxlLmxlbmd0aCA8IDE1KSB7XG4gICAgICB2YXIgaE9uZXMgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoMVwiKTtcblxuICAgICAgaWYgKGhPbmVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjdXJUaXRsZSA9IHRoaXMuX2dldElubmVyVGV4dChoT25lc1swXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3VyVGl0bGUgPSBjdXJUaXRsZS50cmltKCkucmVwbGFjZSh0aGlzLlJFR0VYUFMubm9ybWFsaXplLCBcIiBcIik7XG4gICAgLy8gSWYgd2Ugbm93IGhhdmUgNCB3b3JkcyBvciBmZXdlciBhcyBvdXIgdGl0bGUsIGFuZCBlaXRoZXIgbm9cbiAgICAvLyAnaGllcmFyY2hpY2FsJyBzZXBhcmF0b3JzIChcXCwgLywgPiBvciDCuykgd2VyZSBmb3VuZCBpbiB0aGUgb3JpZ2luYWxcbiAgICAvLyB0aXRsZSBvciB3ZSBkZWNyZWFzZWQgdGhlIG51bWJlciBvZiB3b3JkcyBieSBtb3JlIHRoYW4gMSB3b3JkLCB1c2VcbiAgICAvLyB0aGUgb3JpZ2luYWwgdGl0bGUuXG4gICAgdmFyIGN1clRpdGxlV29yZENvdW50ID0gd29yZENvdW50KGN1clRpdGxlKTtcbiAgICBpZiAoXG4gICAgICBjdXJUaXRsZVdvcmRDb3VudCA8PSA0ICYmXG4gICAgICAoIXRpdGxlSGFkSGllcmFyY2hpY2FsU2VwYXJhdG9ycyB8fFxuICAgICAgICBjdXJUaXRsZVdvcmRDb3VudCAhPVxuICAgICAgICAgIHdvcmRDb3VudChvcmlnVGl0bGUucmVwbGFjZSgvW1xcfFxcLVxcXFxcXC8+wrtdKy9nLCBcIlwiKSkgLSAxKVxuICAgICkge1xuICAgICAgY3VyVGl0bGUgPSBvcmlnVGl0bGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1clRpdGxlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQcmVwYXJlIHRoZSBIVE1MIGRvY3VtZW50IGZvciByZWFkYWJpbGl0eSB0byBzY3JhcGUgaXQuXG4gICAqIFRoaXMgaW5jbHVkZXMgdGhpbmdzIGxpa2Ugc3RyaXBwaW5nIGphdmFzY3JpcHQsIENTUywgYW5kIGhhbmRsaW5nIHRlcnJpYmxlIG1hcmt1cC5cbiAgICpcbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgX3ByZXBEb2N1bWVudCgpIHtcbiAgICB2YXIgZG9jID0gdGhpcy5fZG9jO1xuXG4gICAgLy8gUmVtb3ZlIGFsbCBzdHlsZSB0YWdzIGluIGhlYWRcbiAgICB0aGlzLl9yZW1vdmVOb2Rlcyh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZG9jLCBbXCJzdHlsZVwiXSkpO1xuXG4gICAgaWYgKGRvYy5ib2R5KSB7XG4gICAgICB0aGlzLl9yZXBsYWNlQnJzKGRvYy5ib2R5KTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZXBsYWNlTm9kZVRhZ3ModGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGRvYywgW1wiZm9udFwiXSksIFwiU1BBTlwiKTtcbiAgfSxcblxuICAvKipcbiAgICogRmluZHMgdGhlIG5leHQgbm9kZSwgc3RhcnRpbmcgZnJvbSB0aGUgZ2l2ZW4gbm9kZSwgYW5kIGlnbm9yaW5nXG4gICAqIHdoaXRlc3BhY2UgaW4gYmV0d2Vlbi4gSWYgdGhlIGdpdmVuIG5vZGUgaXMgYW4gZWxlbWVudCwgdGhlIHNhbWUgbm9kZSBpc1xuICAgKiByZXR1cm5lZC5cbiAgICovXG4gIF9uZXh0Tm9kZShub2RlKSB7XG4gICAgdmFyIG5leHQgPSBub2RlO1xuICAgIHdoaWxlIChcbiAgICAgIG5leHQgJiZcbiAgICAgIG5leHQubm9kZVR5cGUgIT0gdGhpcy5FTEVNRU5UX05PREUgJiZcbiAgICAgIHRoaXMuUkVHRVhQUy53aGl0ZXNwYWNlLnRlc3QobmV4dC50ZXh0Q29udGVudClcbiAgICApIHtcbiAgICAgIG5leHQgPSBuZXh0Lm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gbmV4dDtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgMiBvciBtb3JlIHN1Y2Nlc3NpdmUgPGJyPiBlbGVtZW50cyB3aXRoIGEgc2luZ2xlIDxwPi5cbiAgICogV2hpdGVzcGFjZSBiZXR3ZWVuIDxicj4gZWxlbWVudHMgYXJlIGlnbm9yZWQuIEZvciBleGFtcGxlOlxuICAgKiAgIDxkaXY+Zm9vPGJyPmJhcjxicj4gPGJyPjxicj5hYmM8L2Rpdj5cbiAgICogd2lsbCBiZWNvbWU6XG4gICAqICAgPGRpdj5mb288YnI+YmFyPHA+YWJjPC9wPjwvZGl2PlxuICAgKi9cbiAgX3JlcGxhY2VCcnMoZWxlbSkge1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhlbGVtLCBbXCJiclwiXSksIGZ1bmN0aW9uIChicikge1xuICAgICAgdmFyIG5leHQgPSBici5uZXh0U2libGluZztcblxuICAgICAgLy8gV2hldGhlciAyIG9yIG1vcmUgPGJyPiBlbGVtZW50cyBoYXZlIGJlZW4gZm91bmQgYW5kIHJlcGxhY2VkIHdpdGggYVxuICAgICAgLy8gPHA+IGJsb2NrLlxuICAgICAgdmFyIHJlcGxhY2VkID0gZmFsc2U7XG5cbiAgICAgIC8vIElmIHdlIGZpbmQgYSA8YnI+IGNoYWluLCByZW1vdmUgdGhlIDxicj5zIHVudGlsIHdlIGhpdCBhbm90aGVyIG5vZGVcbiAgICAgIC8vIG9yIG5vbi13aGl0ZXNwYWNlLiBUaGlzIGxlYXZlcyBiZWhpbmQgdGhlIGZpcnN0IDxicj4gaW4gdGhlIGNoYWluXG4gICAgICAvLyAod2hpY2ggd2lsbCBiZSByZXBsYWNlZCB3aXRoIGEgPHA+IGxhdGVyKS5cbiAgICAgIHdoaWxlICgobmV4dCA9IHRoaXMuX25leHROb2RlKG5leHQpKSAmJiBuZXh0LnRhZ05hbWUgPT0gXCJCUlwiKSB7XG4gICAgICAgIHJlcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgdmFyIGJyU2libGluZyA9IG5leHQubmV4dFNpYmxpbmc7XG4gICAgICAgIG5leHQucmVtb3ZlKCk7XG4gICAgICAgIG5leHQgPSBiclNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIHJlbW92ZWQgYSA8YnI+IGNoYWluLCByZXBsYWNlIHRoZSByZW1haW5pbmcgPGJyPiB3aXRoIGEgPHA+LiBBZGRcbiAgICAgIC8vIGFsbCBzaWJsaW5nIG5vZGVzIGFzIGNoaWxkcmVuIG9mIHRoZSA8cD4gdW50aWwgd2UgaGl0IGFub3RoZXIgPGJyPlxuICAgICAgLy8gY2hhaW4uXG4gICAgICBpZiAocmVwbGFjZWQpIHtcbiAgICAgICAgdmFyIHAgPSB0aGlzLl9kb2MuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGJyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHAsIGJyKTtcblxuICAgICAgICBuZXh0ID0gcC5uZXh0U2libGluZztcbiAgICAgICAgd2hpbGUgKG5leHQpIHtcbiAgICAgICAgICAvLyBJZiB3ZSd2ZSBoaXQgYW5vdGhlciA8YnI+PGJyPiwgd2UncmUgZG9uZSBhZGRpbmcgY2hpbGRyZW4gdG8gdGhpcyA8cD4uXG4gICAgICAgICAgaWYgKG5leHQudGFnTmFtZSA9PSBcIkJSXCIpIHtcbiAgICAgICAgICAgIHZhciBuZXh0RWxlbSA9IHRoaXMuX25leHROb2RlKG5leHQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgaWYgKG5leHRFbGVtICYmIG5leHRFbGVtLnRhZ05hbWUgPT0gXCJCUlwiKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy5faXNQaHJhc2luZ0NvbnRlbnQobmV4dCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgbWFrZSB0aGlzIG5vZGUgYSBjaGlsZCBvZiB0aGUgbmV3IDxwPi5cbiAgICAgICAgICB2YXIgc2libGluZyA9IG5leHQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgcC5hcHBlbmRDaGlsZChuZXh0KTtcbiAgICAgICAgICBuZXh0ID0gc2libGluZztcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChwLmxhc3RDaGlsZCAmJiB0aGlzLl9pc1doaXRlc3BhY2UocC5sYXN0Q2hpbGQpKSB7XG4gICAgICAgICAgcC5sYXN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocC5wYXJlbnROb2RlLnRhZ05hbWUgPT09IFwiUFwiKSB7XG4gICAgICAgICAgdGhpcy5fc2V0Tm9kZVRhZyhwLnBhcmVudE5vZGUsIFwiRElWXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3NldE5vZGVUYWcobm9kZSwgdGFnKSB7XG4gICAgdGhpcy5sb2coXCJfc2V0Tm9kZVRhZ1wiLCBub2RlLCB0YWcpO1xuICAgIGlmICh0aGlzLl9kb2NKU0RPTVBhcnNlcikge1xuICAgICAgbm9kZS5sb2NhbE5hbWUgPSB0YWcudG9Mb3dlckNhc2UoKTtcbiAgICAgIG5vZGUudGFnTmFtZSA9IHRhZy50b1VwcGVyQ2FzZSgpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgdmFyIHJlcGxhY2VtZW50ID0gbm9kZS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICB3aGlsZSAobm9kZS5maXJzdENoaWxkKSB7XG4gICAgICByZXBsYWNlbWVudC5hcHBlbmRDaGlsZChub2RlLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LCBub2RlKTtcbiAgICBpZiAobm9kZS5yZWFkYWJpbGl0eSkge1xuICAgICAgcmVwbGFjZW1lbnQucmVhZGFiaWxpdHkgPSBub2RlLnJlYWRhYmlsaXR5O1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXBsYWNlbWVudC5zZXRBdHRyaWJ1dGVOb2RlKG5vZGUuYXR0cmlidXRlc1tpXS5jbG9uZU5vZGUoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXBsYWNlbWVudDtcbiAgfSxcblxuICAvKipcbiAgICogUHJlcGFyZSB0aGUgYXJ0aWNsZSBub2RlIGZvciBkaXNwbGF5LiBDbGVhbiBvdXQgYW55IGlubGluZSBzdHlsZXMsXG4gICAqIGlmcmFtZXMsIGZvcm1zLCBzdHJpcCBleHRyYW5lb3VzIDxwPiB0YWdzLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKiovXG4gIF9wcmVwQXJ0aWNsZShhcnRpY2xlQ29udGVudCkge1xuICAgIHRoaXMuX2NsZWFuU3R5bGVzKGFydGljbGVDb250ZW50KTtcblxuICAgIC8vIENoZWNrIGZvciBkYXRhIHRhYmxlcyBiZWZvcmUgd2UgY29udGludWUsIHRvIGF2b2lkIHJlbW92aW5nIGl0ZW1zIGluXG4gICAgLy8gdGhvc2UgdGFibGVzLCB3aGljaCB3aWxsIG9mdGVuIGJlIGlzb2xhdGVkIGV2ZW4gdGhvdWdoIHRoZXkncmVcbiAgICAvLyB2aXN1YWxseSBsaW5rZWQgdG8gb3RoZXIgY29udGVudC1mdWwgZWxlbWVudHMgKHRleHQsIGltYWdlcywgZXRjLikuXG4gICAgdGhpcy5fbWFya0RhdGFUYWJsZXMoYXJ0aWNsZUNvbnRlbnQpO1xuXG4gICAgdGhpcy5fZml4TGF6eUltYWdlcyhhcnRpY2xlQ29udGVudCk7XG5cbiAgICAvLyBDbGVhbiBvdXQganVuayBmcm9tIHRoZSBhcnRpY2xlIGNvbnRlbnRcbiAgICB0aGlzLl9jbGVhbkNvbmRpdGlvbmFsbHkoYXJ0aWNsZUNvbnRlbnQsIFwiZm9ybVwiKTtcbiAgICB0aGlzLl9jbGVhbkNvbmRpdGlvbmFsbHkoYXJ0aWNsZUNvbnRlbnQsIFwiZmllbGRzZXRcIik7XG4gICAgdGhpcy5fY2xlYW4oYXJ0aWNsZUNvbnRlbnQsIFwib2JqZWN0XCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImVtYmVkXCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImZvb3RlclwiKTtcbiAgICB0aGlzLl9jbGVhbihhcnRpY2xlQ29udGVudCwgXCJsaW5rXCIpO1xuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImFzaWRlXCIpO1xuXG4gICAgLy8gQ2xlYW4gb3V0IGVsZW1lbnRzIHdpdGggbGl0dGxlIGNvbnRlbnQgdGhhdCBoYXZlIFwic2hhcmVcIiBpbiB0aGVpciBpZC9jbGFzcyBjb21iaW5hdGlvbnMgZnJvbSBmaW5hbCB0b3AgY2FuZGlkYXRlcyxcbiAgICAvLyB3aGljaCBtZWFucyB3ZSBkb24ndCByZW1vdmUgdGhlIHRvcCBjYW5kaWRhdGVzIGV2ZW4gdGhleSBoYXZlIFwic2hhcmVcIi5cblxuICAgIHZhciBzaGFyZUVsZW1lbnRUaHJlc2hvbGQgPSB0aGlzLkRFRkFVTFRfQ0hBUl9USFJFU0hPTEQ7XG5cbiAgICB0aGlzLl9mb3JFYWNoTm9kZShhcnRpY2xlQ29udGVudC5jaGlsZHJlbiwgZnVuY3Rpb24gKHRvcENhbmRpZGF0ZSkge1xuICAgICAgdGhpcy5fY2xlYW5NYXRjaGVkTm9kZXModG9wQ2FuZGlkYXRlLCBmdW5jdGlvbiAobm9kZSwgbWF0Y2hTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aGlzLlJFR0VYUFMuc2hhcmVFbGVtZW50cy50ZXN0KG1hdGNoU3RyaW5nKSAmJlxuICAgICAgICAgIG5vZGUudGV4dENvbnRlbnQubGVuZ3RoIDwgc2hhcmVFbGVtZW50VGhyZXNob2xkXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NsZWFuKGFydGljbGVDb250ZW50LCBcImlmcmFtZVwiKTtcbiAgICB0aGlzLl9jbGVhbihhcnRpY2xlQ29udGVudCwgXCJpbnB1dFwiKTtcbiAgICB0aGlzLl9jbGVhbihhcnRpY2xlQ29udGVudCwgXCJ0ZXh0YXJlYVwiKTtcbiAgICB0aGlzLl9jbGVhbihhcnRpY2xlQ29udGVudCwgXCJzZWxlY3RcIik7XG4gICAgdGhpcy5fY2xlYW4oYXJ0aWNsZUNvbnRlbnQsIFwiYnV0dG9uXCIpO1xuICAgIHRoaXMuX2NsZWFuSGVhZGVycyhhcnRpY2xlQ29udGVudCk7XG5cbiAgICAvLyBEbyB0aGVzZSBsYXN0IGFzIHRoZSBwcmV2aW91cyBzdHVmZiBtYXkgaGF2ZSByZW1vdmVkIGp1bmtcbiAgICAvLyB0aGF0IHdpbGwgYWZmZWN0IHRoZXNlXG4gICAgdGhpcy5fY2xlYW5Db25kaXRpb25hbGx5KGFydGljbGVDb250ZW50LCBcInRhYmxlXCIpO1xuICAgIHRoaXMuX2NsZWFuQ29uZGl0aW9uYWxseShhcnRpY2xlQ29udGVudCwgXCJ1bFwiKTtcbiAgICB0aGlzLl9jbGVhbkNvbmRpdGlvbmFsbHkoYXJ0aWNsZUNvbnRlbnQsIFwiZGl2XCIpO1xuXG4gICAgLy8gcmVwbGFjZSBIMSB3aXRoIEgyIGFzIEgxIHNob3VsZCBiZSBvbmx5IHRpdGxlIHRoYXQgaXMgZGlzcGxheWVkIHNlcGFyYXRlbHlcbiAgICB0aGlzLl9yZXBsYWNlTm9kZVRhZ3MoXG4gICAgICB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoYXJ0aWNsZUNvbnRlbnQsIFtcImgxXCJdKSxcbiAgICAgIFwiaDJcIlxuICAgICk7XG5cbiAgICAvLyBSZW1vdmUgZXh0cmEgcGFyYWdyYXBoc1xuICAgIHRoaXMuX3JlbW92ZU5vZGVzKFxuICAgICAgdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGFydGljbGVDb250ZW50LCBbXCJwXCJdKSxcbiAgICAgIGZ1bmN0aW9uIChwYXJhZ3JhcGgpIHtcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCwgbmFzdHkgaWZyYW1lcyBoYXZlIGJlZW4gcmVtb3ZlZDsgb25seSBlbWJlZGRlZCB2aWRlb1xuICAgICAgICAvLyBvbmVzIHJlbWFpbi5cbiAgICAgICAgdmFyIGNvbnRlbnRFbGVtZW50Q291bnQgPSB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcocGFyYWdyYXBoLCBbXG4gICAgICAgICAgXCJpbWdcIixcbiAgICAgICAgICBcImVtYmVkXCIsXG4gICAgICAgICAgXCJvYmplY3RcIixcbiAgICAgICAgICBcImlmcmFtZVwiLFxuICAgICAgICBdKS5sZW5ndGg7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgY29udGVudEVsZW1lbnRDb3VudCA9PT0gMCAmJiAhdGhpcy5fZ2V0SW5uZXJUZXh0KHBhcmFncmFwaCwgZmFsc2UpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuX2ZvckVhY2hOb2RlKFxuICAgICAgdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGFydGljbGVDb250ZW50LCBbXCJiclwiXSksXG4gICAgICBmdW5jdGlvbiAoYnIpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLl9uZXh0Tm9kZShici5uZXh0U2libGluZyk7XG4gICAgICAgIGlmIChuZXh0ICYmIG5leHQudGFnTmFtZSA9PSBcIlBcIikge1xuICAgICAgICAgIGJyLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIFJlbW92ZSBzaW5nbGUtY2VsbCB0YWJsZXNcbiAgICB0aGlzLl9mb3JFYWNoTm9kZShcbiAgICAgIHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhhcnRpY2xlQ29udGVudCwgW1widGFibGVcIl0pLFxuICAgICAgZnVuY3Rpb24gKHRhYmxlKSB7XG4gICAgICAgIHZhciB0Ym9keSA9IHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQodGFibGUsIFwiVEJPRFlcIilcbiAgICAgICAgICA/IHRhYmxlLmZpcnN0RWxlbWVudENoaWxkXG4gICAgICAgICAgOiB0YWJsZTtcbiAgICAgICAgaWYgKHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQodGJvZHksIFwiVFJcIikpIHtcbiAgICAgICAgICB2YXIgcm93ID0gdGJvZHkuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgaWYgKHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQocm93LCBcIlREXCIpKSB7XG4gICAgICAgICAgICB2YXIgY2VsbCA9IHJvdy5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIGNlbGwgPSB0aGlzLl9zZXROb2RlVGFnKFxuICAgICAgICAgICAgICBjZWxsLFxuICAgICAgICAgICAgICB0aGlzLl9ldmVyeU5vZGUoY2VsbC5jaGlsZE5vZGVzLCB0aGlzLl9pc1BocmFzaW5nQ29udGVudClcbiAgICAgICAgICAgICAgICA/IFwiUFwiXG4gICAgICAgICAgICAgICAgOiBcIkRJVlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGFibGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2VsbCwgdGFibGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBub2RlIHdpdGggdGhlIHJlYWRhYmlsaXR5IG9iamVjdC4gQWxzbyBjaGVja3MgdGhlXG4gICAqIGNsYXNzTmFtZS9pZCBmb3Igc3BlY2lhbCBuYW1lcyB0byBhZGQgdG8gaXRzIHNjb3JlLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICoqL1xuICBfaW5pdGlhbGl6ZU5vZGUobm9kZSkge1xuICAgIG5vZGUucmVhZGFiaWxpdHkgPSB7IGNvbnRlbnRTY29yZTogMCB9O1xuXG4gICAgc3dpdGNoIChub2RlLnRhZ05hbWUpIHtcbiAgICAgIGNhc2UgXCJESVZcIjpcbiAgICAgICAgbm9kZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKz0gNTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJQUkVcIjpcbiAgICAgIGNhc2UgXCJURFwiOlxuICAgICAgY2FzZSBcIkJMT0NLUVVPVEVcIjpcbiAgICAgICAgbm9kZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKz0gMztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJBRERSRVNTXCI6XG4gICAgICBjYXNlIFwiT0xcIjpcbiAgICAgIGNhc2UgXCJVTFwiOlxuICAgICAgY2FzZSBcIkRMXCI6XG4gICAgICBjYXNlIFwiRERcIjpcbiAgICAgIGNhc2UgXCJEVFwiOlxuICAgICAgY2FzZSBcIkxJXCI6XG4gICAgICBjYXNlIFwiRk9STVwiOlxuICAgICAgICBub2RlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSAtPSAzO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIkgxXCI6XG4gICAgICBjYXNlIFwiSDJcIjpcbiAgICAgIGNhc2UgXCJIM1wiOlxuICAgICAgY2FzZSBcIkg0XCI6XG4gICAgICBjYXNlIFwiSDVcIjpcbiAgICAgIGNhc2UgXCJINlwiOlxuICAgICAgY2FzZSBcIlRIXCI6XG4gICAgICAgIG5vZGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlIC09IDU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG5vZGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlICs9IHRoaXMuX2dldENsYXNzV2VpZ2h0KG5vZGUpO1xuICB9LFxuXG4gIF9yZW1vdmVBbmRHZXROZXh0KG5vZGUpIHtcbiAgICB2YXIgbmV4dE5vZGUgPSB0aGlzLl9nZXROZXh0Tm9kZShub2RlLCB0cnVlKTtcbiAgICBub2RlLnJlbW92ZSgpO1xuICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgfSxcblxuICAvKipcbiAgICogVHJhdmVyc2UgdGhlIERPTSBmcm9tIG5vZGUgdG8gbm9kZSwgc3RhcnRpbmcgYXQgdGhlIG5vZGUgcGFzc2VkIGluLlxuICAgKiBQYXNzIHRydWUgZm9yIHRoZSBzZWNvbmQgcGFyYW1ldGVyIHRvIGluZGljYXRlIHRoaXMgbm9kZSBpdHNlbGZcbiAgICogKGFuZCBpdHMga2lkcykgYXJlIGdvaW5nIGF3YXksIGFuZCB3ZSB3YW50IHRoZSBuZXh0IG5vZGUgb3Zlci5cbiAgICpcbiAgICogQ2FsbGluZyB0aGlzIGluIGEgbG9vcCB3aWxsIHRyYXZlcnNlIHRoZSBET00gZGVwdGgtZmlyc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVNlbGZBbmRLaWRzXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuICBfZ2V0TmV4dE5vZGUobm9kZSwgaWdub3JlU2VsZkFuZEtpZHMpIHtcbiAgICAvLyBGaXJzdCBjaGVjayBmb3Iga2lkcyBpZiB0aG9zZSBhcmVuJ3QgYmVpbmcgaWdub3JlZFxuICAgIGlmICghaWdub3JlU2VsZkFuZEtpZHMgJiYgbm9kZS5maXJzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgcmV0dXJuIG5vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuICAgIC8vIFRoZW4gZm9yIHNpYmxpbmdzLi4uXG4gICAgaWYgKG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG4gICAgICByZXR1cm4gbm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgfVxuICAgIC8vIEFuZCBmaW5hbGx5LCBtb3ZlIHVwIHRoZSBwYXJlbnQgY2hhaW4gKmFuZCogZmluZCBhIHNpYmxpbmdcbiAgICAvLyAoYmVjYXVzZSB0aGlzIGlzIGRlcHRoLWZpcnN0IHRyYXZlcnNhbCwgd2Ugd2lsbCBoYXZlIGFscmVhZHlcbiAgICAvLyBzZWVuIHRoZSBwYXJlbnQgbm9kZXMgdGhlbXNlbHZlcykuXG4gICAgZG8ge1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlIChub2RlICYmICFub2RlLm5leHRFbGVtZW50U2libGluZyk7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIH0sXG5cbiAgLy8gY29tcGFyZXMgc2Vjb25kIHRleHQgdG8gZmlyc3Qgb25lXG4gIC8vIDEgPSBzYW1lIHRleHQsIDAgPSBjb21wbGV0ZWx5IGRpZmZlcmVudCB0ZXh0XG4gIC8vIHdvcmtzIHRoZSB3YXkgdGhhdCBpdCBzcGxpdHMgYm90aCB0ZXh0cyBpbnRvIHdvcmRzIGFuZCB0aGVuIGZpbmRzIHdvcmRzIHRoYXQgYXJlIHVuaXF1ZSBpbiBzZWNvbmQgdGV4dFxuICAvLyB0aGUgcmVzdWx0IGlzIGdpdmVuIGJ5IHRoZSBsb3dlciBsZW5ndGggb2YgdW5pcXVlIHBhcnRzXG4gIF90ZXh0U2ltaWxhcml0eSh0ZXh0QSwgdGV4dEIpIHtcbiAgICB2YXIgdG9rZW5zQSA9IHRleHRBXG4gICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgLnNwbGl0KHRoaXMuUkVHRVhQUy50b2tlbml6ZSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgdmFyIHRva2Vuc0IgPSB0ZXh0QlxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5zcGxpdCh0aGlzLlJFR0VYUFMudG9rZW5pemUpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghdG9rZW5zQS5sZW5ndGggfHwgIXRva2Vuc0IubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgdmFyIHVuaXFUb2tlbnNCID0gdG9rZW5zQi5maWx0ZXIodG9rZW4gPT4gIXRva2Vuc0EuaW5jbHVkZXModG9rZW4pKTtcbiAgICB2YXIgZGlzdGFuY2VCID0gdW5pcVRva2Vuc0Iuam9pbihcIiBcIikubGVuZ3RoIC8gdG9rZW5zQi5qb2luKFwiIFwiKS5sZW5ndGg7XG4gICAgcmV0dXJuIDEgLSBkaXN0YW5jZUI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGFuIGVsZW1lbnQgbm9kZSBjb250YWlucyBhIHZhbGlkIGJ5bGluZVxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSB7RWxlbWVudH1cbiAgICogQHBhcmFtIG1hdGNoU3RyaW5nIHtzdHJpbmd9XG4gICAqIEByZXR1cm4gYm9vbGVhblxuICAgKi9cbiAgX2lzVmFsaWRCeWxpbmUobm9kZSwgbWF0Y2hTdHJpbmcpIHtcbiAgICB2YXIgcmVsID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJyZWxcIik7XG4gICAgdmFyIGl0ZW1wcm9wID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJpdGVtcHJvcFwiKTtcbiAgICB2YXIgYnlsaW5lTGVuZ3RoID0gbm9kZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIChyZWwgPT09IFwiYXV0aG9yXCIgfHxcbiAgICAgICAgKGl0ZW1wcm9wICYmIGl0ZW1wcm9wLmluY2x1ZGVzKFwiYXV0aG9yXCIpKSB8fFxuICAgICAgICB0aGlzLlJFR0VYUFMuYnlsaW5lLnRlc3QobWF0Y2hTdHJpbmcpKSAmJlxuICAgICAgISFieWxpbmVMZW5ndGggJiZcbiAgICAgIGJ5bGluZUxlbmd0aCA8IDEwMFxuICAgICk7XG4gIH0sXG5cbiAgX2dldE5vZGVBbmNlc3RvcnMobm9kZSwgbWF4RGVwdGgpIHtcbiAgICBtYXhEZXB0aCA9IG1heERlcHRoIHx8IDA7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgYW5jZXN0b3JzID0gW107XG4gICAgd2hpbGUgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgYW5jZXN0b3JzLnB1c2gobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIGlmIChtYXhEZXB0aCAmJiArK2kgPT09IG1heERlcHRoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGFuY2VzdG9ycztcbiAgfSxcblxuICAvKioqXG4gICAqIGdyYWJBcnRpY2xlIC0gVXNpbmcgYSB2YXJpZXR5IG9mIG1ldHJpY3MgKGNvbnRlbnQgc2NvcmUsIGNsYXNzbmFtZSwgZWxlbWVudCB0eXBlcyksIGZpbmQgdGhlIGNvbnRlbnQgdGhhdCBpc1xuICAgKiAgICAgICAgIG1vc3QgbGlrZWx5IHRvIGJlIHRoZSBzdHVmZiBhIHVzZXIgd2FudHMgdG8gcmVhZC4gVGhlbiByZXR1cm4gaXQgd3JhcHBlZCB1cCBpbiBhIGRpdi5cbiAgICpcbiAgICogQHBhcmFtIHBhZ2UgYSBkb2N1bWVudCB0byBydW4gdXBvbi4gTmVlZHMgdG8gYmUgYSBmdWxsIGRvY3VtZW50LCBjb21wbGV0ZSB3aXRoIGJvZHkuXG4gICAqIEByZXR1cm4gRWxlbWVudFxuICAgKiovXG4gIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5ICovXG4gIF9ncmFiQXJ0aWNsZShwYWdlKSB7XG4gICAgdGhpcy5sb2coXCIqKioqIGdyYWJBcnRpY2xlICoqKipcIik7XG4gICAgdmFyIGRvYyA9IHRoaXMuX2RvYztcbiAgICB2YXIgaXNQYWdpbmcgPSBwYWdlICE9PSBudWxsO1xuICAgIHBhZ2UgPSBwYWdlID8gcGFnZSA6IHRoaXMuX2RvYy5ib2R5O1xuXG4gICAgLy8gV2UgY2FuJ3QgZ3JhYiBhbiBhcnRpY2xlIGlmIHdlIGRvbid0IGhhdmUgYSBwYWdlIVxuICAgIGlmICghcGFnZSkge1xuICAgICAgdGhpcy5sb2coXCJObyBib2R5IGZvdW5kIGluIGRvY3VtZW50LiBBYm9ydC5cIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGFnZUNhY2hlSHRtbCA9IHBhZ2UuaW5uZXJIVE1MO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHRoaXMubG9nKFwiU3RhcnRpbmcgZ3JhYkFydGljbGUgbG9vcFwiKTtcbiAgICAgIHZhciBzdHJpcFVubGlrZWx5Q2FuZGlkYXRlcyA9IHRoaXMuX2ZsYWdJc0FjdGl2ZShcbiAgICAgICAgdGhpcy5GTEFHX1NUUklQX1VOTElLRUxZU1xuICAgICAgKTtcblxuICAgICAgLy8gRmlyc3QsIG5vZGUgcHJlcHBpbmcuIFRyYXNoIG5vZGVzIHRoYXQgbG9vayBjcnVkZHkgKGxpa2Ugb25lcyB3aXRoIHRoZVxuICAgICAgLy8gY2xhc3MgbmFtZSBcImNvbW1lbnRcIiwgZXRjKSwgYW5kIHR1cm4gZGl2cyBpbnRvIFAgdGFncyB3aGVyZSB0aGV5IGhhdmUgYmVlblxuICAgICAgLy8gdXNlZCBpbmFwcHJvcHJpYXRlbHkgKGFzIGluLCB3aGVyZSB0aGV5IGNvbnRhaW4gbm8gb3RoZXIgYmxvY2sgbGV2ZWwgZWxlbWVudHMuKVxuICAgICAgdmFyIGVsZW1lbnRzVG9TY29yZSA9IFtdO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9kb2MuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICBsZXQgc2hvdWxkUmVtb3ZlVGl0bGVIZWFkZXIgPSB0cnVlO1xuXG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS50YWdOYW1lID09PSBcIkhUTUxcIikge1xuICAgICAgICAgIHRoaXMuX2FydGljbGVMYW5nID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1hdGNoU3RyaW5nID0gbm9kZS5jbGFzc05hbWUgKyBcIiBcIiArIG5vZGUuaWQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1Byb2JhYmx5VmlzaWJsZShub2RlKSkge1xuICAgICAgICAgIHRoaXMubG9nKFwiUmVtb3ZpbmcgaGlkZGVuIG5vZGUgLSBcIiArIG1hdGNoU3RyaW5nKTtcbiAgICAgICAgICBub2RlID0gdGhpcy5fcmVtb3ZlQW5kR2V0TmV4dChub2RlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXIgaXMgbm90IGFibGUgdG8gc2VlIGVsZW1lbnRzIGFwcGxpZWQgd2l0aCBib3RoIFwiYXJpYS1tb2RhbCA9IHRydWVcIiBhbmQgXCJyb2xlID0gZGlhbG9nXCJcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1tb2RhbFwiKSA9PSBcInRydWVcIiAmJlxuICAgICAgICAgIG5vZGUuZ2V0QXR0cmlidXRlKFwicm9sZVwiKSA9PSBcImRpYWxvZ1wiXG4gICAgICAgICkge1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIGJ5bGluZSB5ZXQgY2hlY2sgdG8gc2VlIGlmIHRoaXMgbm9kZSBpcyBhIGJ5bGluZTsgaWYgaXQgaXMgc3RvcmUgdGhlIGJ5bGluZSBhbmQgcmVtb3ZlIHRoZSBub2RlLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgIXRoaXMuX2FydGljbGVCeWxpbmUgJiZcbiAgICAgICAgICAhdGhpcy5fbWV0YWRhdGEuYnlsaW5lICYmXG4gICAgICAgICAgdGhpcy5faXNWYWxpZEJ5bGluZShub2RlLCBtYXRjaFN0cmluZylcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gRmluZCBjaGlsZCBub2RlIG1hdGNoaW5nIFtpdGVtcHJvcD1cIm5hbWVcIl0gYW5kIHVzZSB0aGF0IGlmIGl0IGV4aXN0cyBmb3IgYSBtb3JlIGFjY3VyYXRlIGF1dGhvciBuYW1lIGJ5bGluZVxuICAgICAgICAgIHZhciBlbmRPZlNlYXJjaE1hcmtlck5vZGUgPSB0aGlzLl9nZXROZXh0Tm9kZShub2RlLCB0cnVlKTtcbiAgICAgICAgICB2YXIgbmV4dCA9IHRoaXMuX2dldE5leHROb2RlKG5vZGUpO1xuICAgICAgICAgIHZhciBpdGVtUHJvcE5hbWVOb2RlID0gbnVsbDtcbiAgICAgICAgICB3aGlsZSAobmV4dCAmJiBuZXh0ICE9IGVuZE9mU2VhcmNoTWFya2VyTm9kZSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1wcm9wID0gbmV4dC5nZXRBdHRyaWJ1dGUoXCJpdGVtcHJvcFwiKTtcbiAgICAgICAgICAgIGlmIChpdGVtcHJvcCAmJiBpdGVtcHJvcC5pbmNsdWRlcyhcIm5hbWVcIikpIHtcbiAgICAgICAgICAgICAgaXRlbVByb3BOYW1lTm9kZSA9IG5leHQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV4dCA9IHRoaXMuX2dldE5leHROb2RlKG5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9hcnRpY2xlQnlsaW5lID0gKGl0ZW1Qcm9wTmFtZU5vZGUgPz8gbm9kZSkudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3VsZFJlbW92ZVRpdGxlSGVhZGVyICYmIHRoaXMuX2hlYWRlckR1cGxpY2F0ZXNUaXRsZShub2RlKSkge1xuICAgICAgICAgIHRoaXMubG9nKFxuICAgICAgICAgICAgXCJSZW1vdmluZyBoZWFkZXI6IFwiLFxuICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudC50cmltKCksXG4gICAgICAgICAgICB0aGlzLl9hcnRpY2xlVGl0bGUudHJpbSgpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBzaG91bGRSZW1vdmVUaXRsZUhlYWRlciA9IGZhbHNlO1xuICAgICAgICAgIG5vZGUgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5vZGUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIHVubGlrZWx5IGNhbmRpZGF0ZXNcbiAgICAgICAgaWYgKHN0cmlwVW5saWtlbHlDYW5kaWRhdGVzKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5SRUdFWFBTLnVubGlrZWx5Q2FuZGlkYXRlcy50ZXN0KG1hdGNoU3RyaW5nKSAmJlxuICAgICAgICAgICAgIXRoaXMuUkVHRVhQUy5va01heWJlSXRzQUNhbmRpZGF0ZS50ZXN0KG1hdGNoU3RyaW5nKSAmJlxuICAgICAgICAgICAgIXRoaXMuX2hhc0FuY2VzdG9yVGFnKG5vZGUsIFwidGFibGVcIikgJiZcbiAgICAgICAgICAgICF0aGlzLl9oYXNBbmNlc3RvclRhZyhub2RlLCBcImNvZGVcIikgJiZcbiAgICAgICAgICAgIG5vZGUudGFnTmFtZSAhPT0gXCJCT0RZXCIgJiZcbiAgICAgICAgICAgIG5vZGUudGFnTmFtZSAhPT0gXCJBXCJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVtb3ZpbmcgdW5saWtlbHkgY2FuZGlkYXRlIC0gXCIgKyBtYXRjaFN0cmluZyk7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5fcmVtb3ZlQW5kR2V0TmV4dChub2RlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLlVOTElLRUxZX1JPTEVTLmluY2x1ZGVzKG5vZGUuZ2V0QXR0cmlidXRlKFwicm9sZVwiKSkpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFxuICAgICAgICAgICAgICBcIlJlbW92aW5nIGNvbnRlbnQgd2l0aCByb2xlIFwiICtcbiAgICAgICAgICAgICAgICBub2RlLmdldEF0dHJpYnV0ZShcInJvbGVcIikgK1xuICAgICAgICAgICAgICAgIFwiIC0gXCIgK1xuICAgICAgICAgICAgICAgIG1hdGNoU3RyaW5nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX3JlbW92ZUFuZEdldE5leHQobm9kZSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgRElWLCBTRUNUSU9OLCBhbmQgSEVBREVSIG5vZGVzIHdpdGhvdXQgYW55IGNvbnRlbnQoZS5nLiB0ZXh0LCBpbWFnZSwgdmlkZW8sIG9yIGlmcmFtZSkuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAobm9kZS50YWdOYW1lID09PSBcIkRJVlwiIHx8XG4gICAgICAgICAgICBub2RlLnRhZ05hbWUgPT09IFwiU0VDVElPTlwiIHx8XG4gICAgICAgICAgICBub2RlLnRhZ05hbWUgPT09IFwiSEVBREVSXCIgfHxcbiAgICAgICAgICAgIG5vZGUudGFnTmFtZSA9PT0gXCJIMVwiIHx8XG4gICAgICAgICAgICBub2RlLnRhZ05hbWUgPT09IFwiSDJcIiB8fFxuICAgICAgICAgICAgbm9kZS50YWdOYW1lID09PSBcIkgzXCIgfHxcbiAgICAgICAgICAgIG5vZGUudGFnTmFtZSA9PT0gXCJINFwiIHx8XG4gICAgICAgICAgICBub2RlLnRhZ05hbWUgPT09IFwiSDVcIiB8fFxuICAgICAgICAgICAgbm9kZS50YWdOYW1lID09PSBcIkg2XCIpICYmXG4gICAgICAgICAgdGhpcy5faXNFbGVtZW50V2l0aG91dENvbnRlbnQobm9kZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbm9kZSA9IHRoaXMuX3JlbW92ZUFuZEdldE5leHQobm9kZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ERUZBVUxUX1RBR1NfVE9fU0NPUkUuaW5jbHVkZXMobm9kZS50YWdOYW1lKSkge1xuICAgICAgICAgIGVsZW1lbnRzVG9TY29yZS5wdXNoKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHVybiBhbGwgZGl2cyB0aGF0IGRvbid0IGhhdmUgY2hpbGRyZW4gYmxvY2sgbGV2ZWwgZWxlbWVudHMgaW50byBwJ3NcbiAgICAgICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gXCJESVZcIikge1xuICAgICAgICAgIC8vIFB1dCBwaHJhc2luZyBjb250ZW50IGludG8gcGFyYWdyYXBocy5cbiAgICAgICAgICB2YXIgcCA9IG51bGw7XG4gICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICB3aGlsZSAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNQaHJhc2luZ0NvbnRlbnQoY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICBpZiAocCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5faXNXaGl0ZXNwYWNlKGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICBwID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgICAgIG5vZGUucmVwbGFjZUNoaWxkKHAsIGNoaWxkTm9kZSk7XG4gICAgICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgd2hpbGUgKHAubGFzdENoaWxkICYmIHRoaXMuX2lzV2hpdGVzcGFjZShwLmxhc3RDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBwLmxhc3RDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkTm9kZSA9IG5leHRTaWJsaW5nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNpdGVzIGxpa2UgaHR0cDovL21vYmlsZS5zbGF0ZS5jb20gZW5jbG9zZXMgZWFjaCBwYXJhZ3JhcGggd2l0aCBhIERJVlxuICAgICAgICAgIC8vIGVsZW1lbnQuIERJVnMgd2l0aCBvbmx5IGEgUCBlbGVtZW50IGluc2lkZSBhbmQgbm8gdGV4dCBjb250ZW50IGNhbiBiZVxuICAgICAgICAgIC8vIHNhZmVseSBjb252ZXJ0ZWQgaW50byBwbGFpbiBQIGVsZW1lbnRzIHRvIGF2b2lkIGNvbmZ1c2luZyB0aGUgc2NvcmluZ1xuICAgICAgICAgIC8vIGFsZ29yaXRobSB3aXRoIERJVnMgd2l0aCBhcmUsIGluIHByYWN0aWNlLCBwYXJhZ3JhcGhzLlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuX2hhc1NpbmdsZVRhZ0luc2lkZUVsZW1lbnQobm9kZSwgXCJQXCIpICYmXG4gICAgICAgICAgICB0aGlzLl9nZXRMaW5rRGVuc2l0eShub2RlKSA8IDAuMjVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgbm9kZSk7XG4gICAgICAgICAgICBub2RlID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIGVsZW1lbnRzVG9TY29yZS5wdXNoKG5vZGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2hhc0NoaWxkQmxvY2tFbGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5fc2V0Tm9kZVRhZyhub2RlLCBcIlBcIik7XG4gICAgICAgICAgICBlbGVtZW50c1RvU2NvcmUucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IHRoaXMuX2dldE5leHROb2RlKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIExvb3AgdGhyb3VnaCBhbGwgcGFyYWdyYXBocywgYW5kIGFzc2lnbiBhIHNjb3JlIHRvIHRoZW0gYmFzZWQgb24gaG93IGNvbnRlbnQteSB0aGV5IGxvb2suXG4gICAgICAgKiBUaGVuIGFkZCB0aGVpciBzY29yZSB0byB0aGVpciBwYXJlbnQgbm9kZS5cbiAgICAgICAqXG4gICAgICAgKiBBIHNjb3JlIGlzIGRldGVybWluZWQgYnkgdGhpbmdzIGxpa2UgbnVtYmVyIG9mIGNvbW1hcywgY2xhc3MgbmFtZXMsIGV0Yy4gTWF5YmUgZXZlbnR1YWxseSBsaW5rIGRlbnNpdHkuXG4gICAgICAgKiovXG4gICAgICB2YXIgY2FuZGlkYXRlcyA9IFtdO1xuICAgICAgdGhpcy5fZm9yRWFjaE5vZGUoZWxlbWVudHNUb1Njb3JlLCBmdW5jdGlvbiAoZWxlbWVudFRvU2NvcmUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFlbGVtZW50VG9TY29yZS5wYXJlbnROb2RlIHx8XG4gICAgICAgICAgdHlwZW9mIGVsZW1lbnRUb1Njb3JlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHBhcmFncmFwaCBpcyBsZXNzIHRoYW4gMjUgY2hhcmFjdGVycywgZG9uJ3QgZXZlbiBjb3VudCBpdC5cbiAgICAgICAgdmFyIGlubmVyVGV4dCA9IHRoaXMuX2dldElubmVyVGV4dChlbGVtZW50VG9TY29yZSk7XG4gICAgICAgIGlmIChpbm5lclRleHQubGVuZ3RoIDwgMjUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFeGNsdWRlIG5vZGVzIHdpdGggbm8gYW5jZXN0b3IuXG4gICAgICAgIHZhciBhbmNlc3RvcnMgPSB0aGlzLl9nZXROb2RlQW5jZXN0b3JzKGVsZW1lbnRUb1Njb3JlLCA1KTtcbiAgICAgICAgaWYgKGFuY2VzdG9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29udGVudFNjb3JlID0gMDtcblxuICAgICAgICAvLyBBZGQgYSBwb2ludCBmb3IgdGhlIHBhcmFncmFwaCBpdHNlbGYgYXMgYSBiYXNlLlxuICAgICAgICBjb250ZW50U2NvcmUgKz0gMTtcblxuICAgICAgICAvLyBBZGQgcG9pbnRzIGZvciBhbnkgY29tbWFzIHdpdGhpbiB0aGlzIHBhcmFncmFwaC5cbiAgICAgICAgY29udGVudFNjb3JlICs9IGlubmVyVGV4dC5zcGxpdCh0aGlzLlJFR0VYUFMuY29tbWFzKS5sZW5ndGg7XG5cbiAgICAgICAgLy8gRm9yIGV2ZXJ5IDEwMCBjaGFyYWN0ZXJzIGluIHRoaXMgcGFyYWdyYXBoLCBhZGQgYW5vdGhlciBwb2ludC4gVXAgdG8gMyBwb2ludHMuXG4gICAgICAgIGNvbnRlbnRTY29yZSArPSBNYXRoLm1pbihNYXRoLmZsb29yKGlubmVyVGV4dC5sZW5ndGggLyAxMDApLCAzKTtcblxuICAgICAgICAvLyBJbml0aWFsaXplIGFuZCBzY29yZSBhbmNlc3RvcnMuXG4gICAgICAgIHRoaXMuX2ZvckVhY2hOb2RlKGFuY2VzdG9ycywgZnVuY3Rpb24gKGFuY2VzdG9yLCBsZXZlbCkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFhbmNlc3Rvci50YWdOYW1lIHx8XG4gICAgICAgICAgICAhYW5jZXN0b3IucGFyZW50Tm9kZSB8fFxuICAgICAgICAgICAgdHlwZW9mIGFuY2VzdG9yLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgYW5jZXN0b3IucmVhZGFiaWxpdHkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVOb2RlKGFuY2VzdG9yKTtcbiAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChhbmNlc3Rvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm9kZSBzY29yZSBkaXZpZGVyOlxuICAgICAgICAgIC8vIC0gcGFyZW50OiAgICAgICAgICAgICAxIChubyBkaXZpc2lvbilcbiAgICAgICAgICAvLyAtIGdyYW5kcGFyZW50OiAgICAgICAgMlxuICAgICAgICAgIC8vIC0gZ3JlYXQgZ3JhbmRwYXJlbnQrOiBhbmNlc3RvciBsZXZlbCAqIDNcbiAgICAgICAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBzY29yZURpdmlkZXIgPSAxO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09IDEpIHtcbiAgICAgICAgICAgIHNjb3JlRGl2aWRlciA9IDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjb3JlRGl2aWRlciA9IGxldmVsICogMztcbiAgICAgICAgICB9XG4gICAgICAgICAgYW5jZXN0b3IucmVhZGFiaWxpdHkuY29udGVudFNjb3JlICs9IGNvbnRlbnRTY29yZSAvIHNjb3JlRGl2aWRlcjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQWZ0ZXIgd2UndmUgY2FsY3VsYXRlZCBzY29yZXMsIGxvb3AgdGhyb3VnaCBhbGwgb2YgdGhlIHBvc3NpYmxlXG4gICAgICAvLyBjYW5kaWRhdGUgbm9kZXMgd2UgZm91bmQgYW5kIGZpbmQgdGhlIG9uZSB3aXRoIHRoZSBoaWdoZXN0IHNjb3JlLlxuICAgICAgdmFyIHRvcENhbmRpZGF0ZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGMgPSAwLCBjbCA9IGNhbmRpZGF0ZXMubGVuZ3RoOyBjIDwgY2w7IGMgKz0gMSkge1xuICAgICAgICB2YXIgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tjXTtcblxuICAgICAgICAvLyBTY2FsZSB0aGUgZmluYWwgY2FuZGlkYXRlcyBzY29yZSBiYXNlZCBvbiBsaW5rIGRlbnNpdHkuIEdvb2QgY29udGVudFxuICAgICAgICAvLyBzaG91bGQgaGF2ZSBhIHJlbGF0aXZlbHkgc21hbGwgbGluayBkZW5zaXR5ICg1JSBvciBsZXNzKSBhbmQgYmUgbW9zdGx5XG4gICAgICAgIC8vIHVuYWZmZWN0ZWQgYnkgdGhpcyBvcGVyYXRpb24uXG4gICAgICAgIHZhciBjYW5kaWRhdGVTY29yZSA9XG4gICAgICAgICAgY2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSAqXG4gICAgICAgICAgKDEgLSB0aGlzLl9nZXRMaW5rRGVuc2l0eShjYW5kaWRhdGUpKTtcbiAgICAgICAgY2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSA9IGNhbmRpZGF0ZVNjb3JlO1xuXG4gICAgICAgIHRoaXMubG9nKFwiQ2FuZGlkYXRlOlwiLCBjYW5kaWRhdGUsIFwid2l0aCBzY29yZSBcIiArIGNhbmRpZGF0ZVNjb3JlKTtcblxuICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRoaXMuX25iVG9wQ2FuZGlkYXRlczsgdCsrKSB7XG4gICAgICAgICAgdmFyIGFUb3BDYW5kaWRhdGUgPSB0b3BDYW5kaWRhdGVzW3RdO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWFUb3BDYW5kaWRhdGUgfHxcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNjb3JlID4gYVRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvcENhbmRpZGF0ZXMuc3BsaWNlKHQsIDAsIGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICBpZiAodG9wQ2FuZGlkYXRlcy5sZW5ndGggPiB0aGlzLl9uYlRvcENhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgICAgdG9wQ2FuZGlkYXRlcy5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdG9wQ2FuZGlkYXRlID0gdG9wQ2FuZGlkYXRlc1swXSB8fCBudWxsO1xuICAgICAgdmFyIG5lZWRlZFRvQ3JlYXRlVG9wQ2FuZGlkYXRlID0gZmFsc2U7XG4gICAgICB2YXIgcGFyZW50T2ZUb3BDYW5kaWRhdGU7XG5cbiAgICAgIC8vIElmIHdlIHN0aWxsIGhhdmUgbm8gdG9wIGNhbmRpZGF0ZSwganVzdCB1c2UgdGhlIGJvZHkgYXMgYSBsYXN0IHJlc29ydC5cbiAgICAgIC8vIFdlIGFsc28gaGF2ZSB0byBjb3B5IHRoZSBib2R5IG5vZGUgc28gaXQgaXMgc29tZXRoaW5nIHdlIGNhbiBtb2RpZnkuXG4gICAgICBpZiAodG9wQ2FuZGlkYXRlID09PSBudWxsIHx8IHRvcENhbmRpZGF0ZS50YWdOYW1lID09PSBcIkJPRFlcIikge1xuICAgICAgICAvLyBNb3ZlIGFsbCBvZiB0aGUgcGFnZSdzIGNoaWxkcmVuIGludG8gdG9wQ2FuZGlkYXRlXG4gICAgICAgIHRvcENhbmRpZGF0ZSA9IGRvYy5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICBuZWVkZWRUb0NyZWF0ZVRvcENhbmRpZGF0ZSA9IHRydWU7XG4gICAgICAgIC8vIE1vdmUgZXZlcnl0aGluZyAobm90IGp1c3QgZWxlbWVudHMsIGFsc28gdGV4dCBub2RlcyBldGMuKSBpbnRvIHRoZSBjb250YWluZXJcbiAgICAgICAgLy8gc28gd2UgZXZlbiBpbmNsdWRlIHRleHQgZGlyZWN0bHkgaW4gdGhlIGJvZHk6XG4gICAgICAgIHdoaWxlIChwYWdlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICB0aGlzLmxvZyhcIk1vdmluZyBjaGlsZCBvdXQ6XCIsIHBhZ2UuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgdG9wQ2FuZGlkYXRlLmFwcGVuZENoaWxkKHBhZ2UuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlLmFwcGVuZENoaWxkKHRvcENhbmRpZGF0ZSk7XG5cbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZU5vZGUodG9wQ2FuZGlkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAodG9wQ2FuZGlkYXRlKSB7XG4gICAgICAgIC8vIEZpbmQgYSBiZXR0ZXIgdG9wIGNhbmRpZGF0ZSBub2RlIGlmIGl0IGNvbnRhaW5zIChhdCBsZWFzdCB0aHJlZSkgbm9kZXMgd2hpY2ggYmVsb25nIHRvIGB0b3BDYW5kaWRhdGVzYCBhcnJheVxuICAgICAgICAvLyBhbmQgd2hvc2Ugc2NvcmVzIGFyZSBxdWl0ZSBjbG9zZWQgd2l0aCBjdXJyZW50IGB0b3BDYW5kaWRhdGVgIG5vZGUuXG4gICAgICAgIHZhciBhbHRlcm5hdGl2ZUNhbmRpZGF0ZUFuY2VzdG9ycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRvcENhbmRpZGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0b3BDYW5kaWRhdGVzW2ldLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSAvXG4gICAgICAgICAgICAgIHRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgPj1cbiAgICAgICAgICAgIDAuNzVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGFsdGVybmF0aXZlQ2FuZGlkYXRlQW5jZXN0b3JzLnB1c2goXG4gICAgICAgICAgICAgIHRoaXMuX2dldE5vZGVBbmNlc3RvcnModG9wQ2FuZGlkYXRlc1tpXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBNSU5JTVVNX1RPUENBTkRJREFURVMgPSAzO1xuICAgICAgICBpZiAoYWx0ZXJuYXRpdmVDYW5kaWRhdGVBbmNlc3RvcnMubGVuZ3RoID49IE1JTklNVU1fVE9QQ0FORElEQVRFUykge1xuICAgICAgICAgIHBhcmVudE9mVG9wQ2FuZGlkYXRlID0gdG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgICAgd2hpbGUgKHBhcmVudE9mVG9wQ2FuZGlkYXRlLnRhZ05hbWUgIT09IFwiQk9EWVwiKSB7XG4gICAgICAgICAgICB2YXIgbGlzdHNDb250YWluaW5nVGhpc0FuY2VzdG9yID0gMDtcbiAgICAgICAgICAgIGZvciAoXG4gICAgICAgICAgICAgIHZhciBhbmNlc3RvckluZGV4ID0gMDtcbiAgICAgICAgICAgICAgYW5jZXN0b3JJbmRleCA8IGFsdGVybmF0aXZlQ2FuZGlkYXRlQW5jZXN0b3JzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICBsaXN0c0NvbnRhaW5pbmdUaGlzQW5jZXN0b3IgPCBNSU5JTVVNX1RPUENBTkRJREFURVM7XG4gICAgICAgICAgICAgIGFuY2VzdG9ySW5kZXgrK1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGxpc3RzQ29udGFpbmluZ1RoaXNBbmNlc3RvciArPSBOdW1iZXIoXG4gICAgICAgICAgICAgICAgYWx0ZXJuYXRpdmVDYW5kaWRhdGVBbmNlc3RvcnNbYW5jZXN0b3JJbmRleF0uaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaXN0c0NvbnRhaW5pbmdUaGlzQW5jZXN0b3IgPj0gTUlOSU1VTV9UT1BDQU5ESURBVEVTKSB7XG4gICAgICAgICAgICAgIHRvcENhbmRpZGF0ZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudE9mVG9wQ2FuZGlkYXRlID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUucGFyZW50Tm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b3BDYW5kaWRhdGUucmVhZGFiaWxpdHkpIHtcbiAgICAgICAgICB0aGlzLl9pbml0aWFsaXplTm9kZSh0b3BDYW5kaWRhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmVjYXVzZSBvZiBvdXIgYm9udXMgc3lzdGVtLCBwYXJlbnRzIG9mIGNhbmRpZGF0ZXMgbWlnaHQgaGF2ZSBzY29yZXNcbiAgICAgICAgLy8gdGhlbXNlbHZlcy4gVGhleSBnZXQgaGFsZiBvZiB0aGUgbm9kZS4gVGhlcmUgd29uJ3QgYmUgbm9kZXMgd2l0aCBoaWdoZXJcbiAgICAgICAgLy8gc2NvcmVzIHRoYW4gb3VyIHRvcENhbmRpZGF0ZSwgYnV0IGlmIHdlIHNlZSB0aGUgc2NvcmUgZ29pbmcgKnVwKiBpbiB0aGUgZmlyc3RcbiAgICAgICAgLy8gZmV3IHN0ZXBzIHVwIHRoZSB0cmVlLCB0aGF0J3MgYSBkZWNlbnQgc2lnbiB0aGF0IHRoZXJlIG1pZ2h0IGJlIG1vcmUgY29udGVudFxuICAgICAgICAvLyBsdXJraW5nIGluIG90aGVyIHBsYWNlcyB0aGF0IHdlIHdhbnQgdG8gdW5pZnkgaW4uIFRoZSBzaWJsaW5nIHN0dWZmXG4gICAgICAgIC8vIGJlbG93IGRvZXMgc29tZSBvZiB0aGF0IC0gYnV0IG9ubHkgaWYgd2UndmUgbG9va2VkIGhpZ2ggZW5vdWdoIHVwIHRoZSBET01cbiAgICAgICAgLy8gdHJlZS5cbiAgICAgICAgcGFyZW50T2ZUb3BDYW5kaWRhdGUgPSB0b3BDYW5kaWRhdGUucGFyZW50Tm9kZTtcbiAgICAgICAgdmFyIGxhc3RTY29yZSA9IHRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmU7XG4gICAgICAgIC8vIFRoZSBzY29yZXMgc2hvdWxkbid0IGdldCB0b28gbG93LlxuICAgICAgICB2YXIgc2NvcmVUaHJlc2hvbGQgPSBsYXN0U2NvcmUgLyAzO1xuICAgICAgICB3aGlsZSAocGFyZW50T2ZUb3BDYW5kaWRhdGUudGFnTmFtZSAhPT0gXCJCT0RZXCIpIHtcbiAgICAgICAgICBpZiAoIXBhcmVudE9mVG9wQ2FuZGlkYXRlLnJlYWRhYmlsaXR5KSB7XG4gICAgICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZSA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHBhcmVudFNjb3JlID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlO1xuICAgICAgICAgIGlmIChwYXJlbnRTY29yZSA8IHNjb3JlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcmVudFNjb3JlID4gbGFzdFNjb3JlKSB7XG4gICAgICAgICAgICAvLyBBbHJpZ2h0ISBXZSBmb3VuZCBhIGJldHRlciBwYXJlbnQgdG8gdXNlLlxuICAgICAgICAgICAgdG9wQ2FuZGlkYXRlID0gcGFyZW50T2ZUb3BDYW5kaWRhdGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdFNjb3JlID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUucmVhZGFiaWxpdHkuY29udGVudFNjb3JlO1xuICAgICAgICAgIHBhcmVudE9mVG9wQ2FuZGlkYXRlID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB0b3AgY2FuZGlkYXRlIGlzIHRoZSBvbmx5IGNoaWxkLCB1c2UgcGFyZW50IGluc3RlYWQuIFRoaXMgd2lsbCBoZWxwIHNpYmxpbmdcbiAgICAgICAgLy8gam9pbmluZyBsb2dpYyB3aGVuIGFkamFjZW50IGNvbnRlbnQgaXMgYWN0dWFsbHkgbG9jYXRlZCBpbiBwYXJlbnQncyBzaWJsaW5nIG5vZGUuXG4gICAgICAgIHBhcmVudE9mVG9wQ2FuZGlkYXRlID0gdG9wQ2FuZGlkYXRlLnBhcmVudE5vZGU7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICBwYXJlbnRPZlRvcENhbmRpZGF0ZS50YWdOYW1lICE9IFwiQk9EWVwiICYmXG4gICAgICAgICAgcGFyZW50T2ZUb3BDYW5kaWRhdGUuY2hpbGRyZW4ubGVuZ3RoID09IDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgdG9wQ2FuZGlkYXRlID0gcGFyZW50T2ZUb3BDYW5kaWRhdGU7XG4gICAgICAgICAgcGFyZW50T2ZUb3BDYW5kaWRhdGUgPSB0b3BDYW5kaWRhdGUucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eSkge1xuICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVOb2RlKHRvcENhbmRpZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSB0aGUgdG9wIGNhbmRpZGF0ZSwgbG9vayB0aHJvdWdoIGl0cyBzaWJsaW5ncyBmb3IgY29udGVudFxuICAgICAgLy8gdGhhdCBtaWdodCBhbHNvIGJlIHJlbGF0ZWQuIFRoaW5ncyBsaWtlIHByZWFtYmxlcywgY29udGVudCBzcGxpdCBieSBhZHNcbiAgICAgIC8vIHRoYXQgd2UgcmVtb3ZlZCwgZXRjLlxuICAgICAgdmFyIGFydGljbGVDb250ZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICBpZiAoaXNQYWdpbmcpIHtcbiAgICAgICAgYXJ0aWNsZUNvbnRlbnQuaWQgPSBcInJlYWRhYmlsaXR5LWNvbnRlbnRcIjtcbiAgICAgIH1cblxuICAgICAgdmFyIHNpYmxpbmdTY29yZVRocmVzaG9sZCA9IE1hdGgubWF4KFxuICAgICAgICAxMCxcbiAgICAgICAgdG9wQ2FuZGlkYXRlLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZSAqIDAuMlxuICAgICAgKTtcbiAgICAgIC8vIEtlZXAgcG90ZW50aWFsIHRvcCBjYW5kaWRhdGUncyBwYXJlbnQgbm9kZSB0byB0cnkgdG8gZ2V0IHRleHQgZGlyZWN0aW9uIG9mIGl0IGxhdGVyLlxuICAgICAgcGFyZW50T2ZUb3BDYW5kaWRhdGUgPSB0b3BDYW5kaWRhdGUucGFyZW50Tm9kZTtcbiAgICAgIHZhciBzaWJsaW5ncyA9IHBhcmVudE9mVG9wQ2FuZGlkYXRlLmNoaWxkcmVuO1xuXG4gICAgICBmb3IgKHZhciBzID0gMCwgc2wgPSBzaWJsaW5ncy5sZW5ndGg7IHMgPCBzbDsgcysrKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gc2libGluZ3Nbc107XG4gICAgICAgIHZhciBhcHBlbmQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmxvZyhcbiAgICAgICAgICBcIkxvb2tpbmcgYXQgc2libGluZyBub2RlOlwiLFxuICAgICAgICAgIHNpYmxpbmcsXG4gICAgICAgICAgc2libGluZy5yZWFkYWJpbGl0eVxuICAgICAgICAgICAgPyBcIndpdGggc2NvcmUgXCIgKyBzaWJsaW5nLnJlYWRhYmlsaXR5LmNvbnRlbnRTY29yZVxuICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubG9nKFxuICAgICAgICAgIFwiU2libGluZyBoYXMgc2NvcmVcIixcbiAgICAgICAgICBzaWJsaW5nLnJlYWRhYmlsaXR5ID8gc2libGluZy5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgOiBcIlVua25vd25cIlxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChzaWJsaW5nID09PSB0b3BDYW5kaWRhdGUpIHtcbiAgICAgICAgICBhcHBlbmQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjb250ZW50Qm9udXMgPSAwO1xuXG4gICAgICAgICAgLy8gR2l2ZSBhIGJvbnVzIGlmIHNpYmxpbmcgbm9kZXMgYW5kIHRvcCBjYW5kaWRhdGVzIGhhdmUgdGhlIGV4YW1wbGUgc2FtZSBjbGFzc25hbWVcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBzaWJsaW5nLmNsYXNzTmFtZSA9PT0gdG9wQ2FuZGlkYXRlLmNsYXNzTmFtZSAmJlxuICAgICAgICAgICAgdG9wQ2FuZGlkYXRlLmNsYXNzTmFtZSAhPT0gXCJcIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29udGVudEJvbnVzICs9IHRvcENhbmRpZGF0ZS5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKiAwLjI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2libGluZy5yZWFkYWJpbGl0eSAmJlxuICAgICAgICAgICAgc2libGluZy5yZWFkYWJpbGl0eS5jb250ZW50U2NvcmUgKyBjb250ZW50Qm9udXMgPj1cbiAgICAgICAgICAgICAgc2libGluZ1Njb3JlVGhyZXNob2xkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBhcHBlbmQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2libGluZy5ub2RlTmFtZSA9PT0gXCJQXCIpIHtcbiAgICAgICAgICAgIHZhciBsaW5rRGVuc2l0eSA9IHRoaXMuX2dldExpbmtEZW5zaXR5KHNpYmxpbmcpO1xuICAgICAgICAgICAgdmFyIG5vZGVDb250ZW50ID0gdGhpcy5fZ2V0SW5uZXJUZXh0KHNpYmxpbmcpO1xuICAgICAgICAgICAgdmFyIG5vZGVMZW5ndGggPSBub2RlQ29udGVudC5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmIChub2RlTGVuZ3RoID4gODAgJiYgbGlua0RlbnNpdHkgPCAwLjI1KSB7XG4gICAgICAgICAgICAgIGFwcGVuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICBub2RlTGVuZ3RoIDwgODAgJiZcbiAgICAgICAgICAgICAgbm9kZUxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgbGlua0RlbnNpdHkgPT09IDAgJiZcbiAgICAgICAgICAgICAgbm9kZUNvbnRlbnQuc2VhcmNoKC9cXC4oIHwkKS8pICE9PSAtMVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGFwcGVuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFwcGVuZCkge1xuICAgICAgICAgIHRoaXMubG9nKFwiQXBwZW5kaW5nIG5vZGU6XCIsIHNpYmxpbmcpO1xuXG4gICAgICAgICAgaWYgKCF0aGlzLkFMVEVSX1RPX0RJVl9FWENFUFRJT05TLmluY2x1ZGVzKHNpYmxpbmcubm9kZU5hbWUpKSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIGEgbm9kZSB0aGF0IGlzbid0IGEgY29tbW9uIGJsb2NrIGxldmVsIGVsZW1lbnQsIGxpa2UgYSBmb3JtIG9yIHRkIHRhZy5cbiAgICAgICAgICAgIC8vIFR1cm4gaXQgaW50byBhIGRpdiBzbyBpdCBkb2Vzbid0IGdldCBmaWx0ZXJlZCBvdXQgbGF0ZXIgYnkgYWNjaWRlbnQuXG4gICAgICAgICAgICB0aGlzLmxvZyhcIkFsdGVyaW5nIHNpYmxpbmc6XCIsIHNpYmxpbmcsIFwidG8gZGl2LlwiKTtcblxuICAgICAgICAgICAgc2libGluZyA9IHRoaXMuX3NldE5vZGVUYWcoc2libGluZywgXCJESVZcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXJ0aWNsZUNvbnRlbnQuYXBwZW5kQ2hpbGQoc2libGluZyk7XG4gICAgICAgICAgLy8gRmV0Y2ggY2hpbGRyZW4gYWdhaW4gdG8gbWFrZSBpdCBjb21wYXRpYmxlXG4gICAgICAgICAgLy8gd2l0aCBET00gcGFyc2VycyB3aXRob3V0IGxpdmUgY29sbGVjdGlvbiBzdXBwb3J0LlxuICAgICAgICAgIHNpYmxpbmdzID0gcGFyZW50T2ZUb3BDYW5kaWRhdGUuY2hpbGRyZW47XG4gICAgICAgICAgLy8gc2libGluZ3MgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGNoaWxkcmVuIGFycmF5LCBhbmRcbiAgICAgICAgICAvLyBzaWJsaW5nIGlzIHJlbW92ZWQgZnJvbSB0aGUgYXJyYXkgd2hlbiB3ZSBjYWxsIGFwcGVuZENoaWxkKCkuXG4gICAgICAgICAgLy8gQXMgYSByZXN1bHQsIHdlIG11c3QgcmV2aXNpdCB0aGlzIGluZGV4IHNpbmNlIHRoZSBub2Rlc1xuICAgICAgICAgIC8vIGhhdmUgYmVlbiBzaGlmdGVkLlxuICAgICAgICAgIHMgLT0gMTtcbiAgICAgICAgICBzbCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9kZWJ1Zykge1xuICAgICAgICB0aGlzLmxvZyhcIkFydGljbGUgY29udGVudCBwcmUtcHJlcDogXCIgKyBhcnRpY2xlQ29udGVudC5pbm5lckhUTUwpO1xuICAgICAgfVxuICAgICAgLy8gU28gd2UgaGF2ZSBhbGwgb2YgdGhlIGNvbnRlbnQgdGhhdCB3ZSBuZWVkLiBOb3cgd2UgY2xlYW4gaXQgdXAgZm9yIHByZXNlbnRhdGlvbi5cbiAgICAgIHRoaXMuX3ByZXBBcnRpY2xlKGFydGljbGVDb250ZW50KTtcbiAgICAgIGlmICh0aGlzLl9kZWJ1Zykge1xuICAgICAgICB0aGlzLmxvZyhcIkFydGljbGUgY29udGVudCBwb3N0LXByZXA6IFwiICsgYXJ0aWNsZUNvbnRlbnQuaW5uZXJIVE1MKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lZWRlZFRvQ3JlYXRlVG9wQ2FuZGlkYXRlKSB7XG4gICAgICAgIC8vIFdlIGFscmVhZHkgY3JlYXRlZCBhIGZha2UgZGl2IHRoaW5nLCBhbmQgdGhlcmUgd291bGRuJ3QgaGF2ZSBiZWVuIGFueSBzaWJsaW5ncyBsZWZ0XG4gICAgICAgIC8vIGZvciB0aGUgcHJldmlvdXMgbG9vcCwgc28gdGhlcmUncyBubyBwb2ludCB0cnlpbmcgdG8gY3JlYXRlIGEgbmV3IGRpdiwgYW5kIHRoZW5cbiAgICAgICAgLy8gbW92ZSBhbGwgdGhlIGNoaWxkcmVuIG92ZXIuIEp1c3QgYXNzaWduIElEcyBhbmQgY2xhc3MgbmFtZXMgaGVyZS4gTm8gbmVlZCB0byBhcHBlbmRcbiAgICAgICAgLy8gYmVjYXVzZSB0aGF0IGFscmVhZHkgaGFwcGVuZWQgYW55d2F5LlxuICAgICAgICB0b3BDYW5kaWRhdGUuaWQgPSBcInJlYWRhYmlsaXR5LXBhZ2UtMVwiO1xuICAgICAgICB0b3BDYW5kaWRhdGUuY2xhc3NOYW1lID0gXCJwYWdlXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICAgIGRpdi5pZCA9IFwicmVhZGFiaWxpdHktcGFnZS0xXCI7XG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcInBhZ2VcIjtcbiAgICAgICAgd2hpbGUgKGFydGljbGVDb250ZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYXJ0aWNsZUNvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgYXJ0aWNsZUNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2RlYnVnKSB7XG4gICAgICAgIHRoaXMubG9nKFwiQXJ0aWNsZSBjb250ZW50IGFmdGVyIHBhZ2luZzogXCIgKyBhcnRpY2xlQ29udGVudC5pbm5lckhUTUwpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyc2VTdWNjZXNzZnVsID0gdHJ1ZTtcblxuICAgICAgLy8gTm93IHRoYXQgd2UndmUgZ29uZSB0aHJvdWdoIHRoZSBmdWxsIGFsZ29yaXRobSwgY2hlY2sgdG8gc2VlIGlmXG4gICAgICAvLyB3ZSBnb3QgYW55IG1lYW5pbmdmdWwgY29udGVudC4gSWYgd2UgZGlkbid0LCB3ZSBtYXkgbmVlZCB0byByZS1ydW5cbiAgICAgIC8vIGdyYWJBcnRpY2xlIHdpdGggZGlmZmVyZW50IGZsYWdzIHNldC4gVGhpcyBnaXZlcyB1cyBhIGhpZ2hlciBsaWtlbGlob29kIG9mXG4gICAgICAvLyBmaW5kaW5nIHRoZSBjb250ZW50LCBhbmQgdGhlIHNpZXZlIGFwcHJvYWNoIGdpdmVzIHVzIGEgaGlnaGVyIGxpa2VsaWhvb2Qgb2ZcbiAgICAgIC8vIGZpbmRpbmcgdGhlIC1yaWdodC0gY29udGVudC5cbiAgICAgIHZhciB0ZXh0TGVuZ3RoID0gdGhpcy5fZ2V0SW5uZXJUZXh0KGFydGljbGVDb250ZW50LCB0cnVlKS5sZW5ndGg7XG4gICAgICBpZiAodGV4dExlbmd0aCA8IHRoaXMuX2NoYXJUaHJlc2hvbGQpIHtcbiAgICAgICAgcGFyc2VTdWNjZXNzZnVsID0gZmFsc2U7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnNhbml0aXplZC9wcm9wZXJ0eVxuICAgICAgICBwYWdlLmlubmVySFRNTCA9IHBhZ2VDYWNoZUh0bWw7XG5cbiAgICAgICAgdGhpcy5fYXR0ZW1wdHMucHVzaCh7XG4gICAgICAgICAgYXJ0aWNsZUNvbnRlbnQsXG4gICAgICAgICAgdGV4dExlbmd0aCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2ZsYWdJc0FjdGl2ZSh0aGlzLkZMQUdfU1RSSVBfVU5MSUtFTFlTKSkge1xuICAgICAgICAgIHRoaXMuX3JlbW92ZUZsYWcodGhpcy5GTEFHX1NUUklQX1VOTElLRUxZUyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZmxhZ0lzQWN0aXZlKHRoaXMuRkxBR19XRUlHSFRfQ0xBU1NFUykpIHtcbiAgICAgICAgICB0aGlzLl9yZW1vdmVGbGFnKHRoaXMuRkxBR19XRUlHSFRfQ0xBU1NFUyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZmxhZ0lzQWN0aXZlKHRoaXMuRkxBR19DTEVBTl9DT05ESVRJT05BTExZKSkge1xuICAgICAgICAgIHRoaXMuX3JlbW92ZUZsYWcodGhpcy5GTEFHX0NMRUFOX0NPTkRJVElPTkFMTFkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE5vIGx1Y2sgYWZ0ZXIgcmVtb3ZpbmcgZmxhZ3MsIGp1c3QgcmV0dXJuIHRoZSBsb25nZXN0IHRleHQgd2UgZm91bmQgZHVyaW5nIHRoZSBkaWZmZXJlbnQgbG9vcHNcbiAgICAgICAgICB0aGlzLl9hdHRlbXB0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi50ZXh0TGVuZ3RoIC0gYS50ZXh0TGVuZ3RoO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gQnV0IGZpcnN0IGNoZWNrIGlmIHdlIGFjdHVhbGx5IGhhdmUgc29tZXRoaW5nXG4gICAgICAgICAgaWYgKCF0aGlzLl9hdHRlbXB0c1swXS50ZXh0TGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhcnRpY2xlQ29udGVudCA9IHRoaXMuX2F0dGVtcHRzWzBdLmFydGljbGVDb250ZW50O1xuICAgICAgICAgIHBhcnNlU3VjY2Vzc2Z1bCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcnNlU3VjY2Vzc2Z1bCkge1xuICAgICAgICAvLyBGaW5kIG91dCB0ZXh0IGRpcmVjdGlvbiBmcm9tIGFuY2VzdG9ycyBvZiBmaW5hbCB0b3AgY2FuZGlkYXRlLlxuICAgICAgICB2YXIgYW5jZXN0b3JzID0gW3BhcmVudE9mVG9wQ2FuZGlkYXRlLCB0b3BDYW5kaWRhdGVdLmNvbmNhdChcbiAgICAgICAgICB0aGlzLl9nZXROb2RlQW5jZXN0b3JzKHBhcmVudE9mVG9wQ2FuZGlkYXRlKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9zb21lTm9kZShhbmNlc3RvcnMsIGZ1bmN0aW9uIChhbmNlc3Rvcikge1xuICAgICAgICAgIGlmICghYW5jZXN0b3IudGFnTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgYXJ0aWNsZURpciA9IGFuY2VzdG9yLmdldEF0dHJpYnV0ZShcImRpclwiKTtcbiAgICAgICAgICBpZiAoYXJ0aWNsZURpcikge1xuICAgICAgICAgICAgdGhpcy5fYXJ0aWNsZURpciA9IGFydGljbGVEaXI7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFydGljbGVDb250ZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ29udmVydHMgc29tZSBvZiB0aGUgY29tbW9uIEhUTUwgZW50aXRpZXMgaW4gc3RyaW5nIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQHBhcmFtIHN0ciB7c3RyaW5nfSAtIGEgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICAgKiBAcmV0dXJuIHN0cmluZyB3aXRob3V0IEhUTUwgZW50aXR5LlxuICAgKi9cbiAgX3VuZXNjYXBlSHRtbEVudGl0aWVzKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHZhciBodG1sRXNjYXBlTWFwID0gdGhpcy5IVE1MX0VTQ0FQRV9NQVA7XG4gICAgcmV0dXJuIHN0clxuICAgICAgLnJlcGxhY2UoLyYocXVvdHxhbXB8YXBvc3xsdHxndCk7L2csIGZ1bmN0aW9uIChfLCB0YWcpIHtcbiAgICAgICAgcmV0dXJuIGh0bWxFc2NhcGVNYXBbdGFnXTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvJiMoPzp4KFswLTlhLWZdKyl8KFswLTldKykpOy9naSwgZnVuY3Rpb24gKF8sIGhleCwgbnVtU3RyKSB7XG4gICAgICAgIHZhciBudW0gPSBwYXJzZUludChoZXggfHwgbnVtU3RyLCBoZXggPyAxNiA6IDEwKTtcblxuICAgICAgICAvLyB0aGVzZSBjaGFyYWN0ZXIgcmVmZXJlbmNlcyBhcmUgcmVwbGFjZWQgYnkgYSBjb25mb3JtaW5nIEhUTUwgcGFyc2VyXG4gICAgICAgIGlmIChudW0gPT0gMCB8fCBudW0gPiAweDEwZmZmZiB8fCAobnVtID49IDB4ZDgwMCAmJiBudW0gPD0gMHhkZmZmKSkge1xuICAgICAgICAgIG51bSA9IDB4ZmZmZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludChudW0pO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyeSB0byBleHRyYWN0IG1ldGFkYXRhIGZyb20gSlNPTi1MRCBvYmplY3QuXG4gICAqIEZvciBub3csIG9ubHkgU2NoZW1hLm9yZyBvYmplY3RzIG9mIHR5cGUgQXJ0aWNsZSBvciBpdHMgc3VidHlwZXMgYXJlIHN1cHBvcnRlZC5cbiAgICogQHJldHVybiBPYmplY3Qgd2l0aCBhbnkgbWV0YWRhdGEgdGhhdCBjb3VsZCBiZSBleHRyYWN0ZWQgKHBvc3NpYmx5IG5vbmUpXG4gICAqL1xuICBfZ2V0SlNPTkxEKGRvYykge1xuICAgIHZhciBzY3JpcHRzID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGRvYywgW1wic2NyaXB0XCJdKTtcblxuICAgIHZhciBtZXRhZGF0YTtcblxuICAgIHRoaXMuX2ZvckVhY2hOb2RlKHNjcmlwdHMsIGZ1bmN0aW9uIChqc29uTGRFbGVtZW50KSB7XG4gICAgICBpZiAoXG4gICAgICAgICFtZXRhZGF0YSAmJlxuICAgICAgICBqc29uTGRFbGVtZW50LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwiYXBwbGljYXRpb24vbGQranNvblwiXG4gICAgICApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTdHJpcCBDREFUQSBtYXJrZXJzIGlmIHByZXNlbnRcbiAgICAgICAgICB2YXIgY29udGVudCA9IGpzb25MZEVsZW1lbnQudGV4dENvbnRlbnQucmVwbGFjZShcbiAgICAgICAgICAgIC9eXFxzKjwhXFxbQ0RBVEFcXFt8XFxdXFxdPlxccyokL2csXG4gICAgICAgICAgICBcIlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICB2YXIgcGFyc2VkID0gSlNPTi5wYXJzZShjb250ZW50KTtcblxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHtcbiAgICAgICAgICAgIHBhcnNlZCA9IHBhcnNlZC5maW5kKGl0ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBpdFtcIkB0eXBlXCJdICYmXG4gICAgICAgICAgICAgICAgaXRbXCJAdHlwZVwiXS5tYXRjaCh0aGlzLlJFR0VYUFMuanNvbkxkQXJ0aWNsZVR5cGVzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNjaGVtYURvdE9yZ1JlZ2V4ID0gL15odHRwcz9cXDpcXC9cXC9zY2hlbWFcXC5vcmdcXC8/JC87XG4gICAgICAgICAgdmFyIG1hdGNoZXMgPVxuICAgICAgICAgICAgKHR5cGVvZiBwYXJzZWRbXCJAY29udGV4dFwiXSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICBwYXJzZWRbXCJAY29udGV4dFwiXS5tYXRjaChzY2hlbWFEb3RPcmdSZWdleCkpIHx8XG4gICAgICAgICAgICAodHlwZW9mIHBhcnNlZFtcIkBjb250ZXh0XCJdID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgIHR5cGVvZiBwYXJzZWRbXCJAY29udGV4dFwiXVtcIkB2b2NhYlwiXSA9PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgIHBhcnNlZFtcIkBjb250ZXh0XCJdW1wiQHZvY2FiXCJdLm1hdGNoKHNjaGVtYURvdE9yZ1JlZ2V4KSk7XG5cbiAgICAgICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXBhcnNlZFtcIkB0eXBlXCJdICYmIEFycmF5LmlzQXJyYXkocGFyc2VkW1wiQGdyYXBoXCJdKSkge1xuICAgICAgICAgICAgcGFyc2VkID0gcGFyc2VkW1wiQGdyYXBoXCJdLmZpbmQoaXQgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKGl0W1wiQHR5cGVcIl0gfHwgXCJcIikubWF0Y2godGhpcy5SRUdFWFBTLmpzb25MZEFydGljbGVUeXBlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhcGFyc2VkIHx8XG4gICAgICAgICAgICAhcGFyc2VkW1wiQHR5cGVcIl0gfHxcbiAgICAgICAgICAgICFwYXJzZWRbXCJAdHlwZVwiXS5tYXRjaCh0aGlzLlJFR0VYUFMuanNvbkxkQXJ0aWNsZVR5cGVzKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1ldGFkYXRhID0ge307XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFyc2VkLm5hbWUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgIHR5cGVvZiBwYXJzZWQuaGVhZGxpbmUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgIHBhcnNlZC5uYW1lICE9PSBwYXJzZWQuaGVhZGxpbmVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgYm90aCBuYW1lIGFuZCBoZWFkbGluZSBlbGVtZW50IGluIHRoZSBKU09OLUxELiBUaGV5IHNob3VsZCBib3RoIGJlIHRoZSBzYW1lIGJ1dCBzb21lIHdlYnNpdGVzIGxpa2UgYWt0dWFsbmUuY3pcbiAgICAgICAgICAgIC8vIHB1dCB0aGVpciBvd24gbmFtZSBpbnRvIFwibmFtZVwiIGFuZCB0aGUgYXJ0aWNsZSB0aXRsZSB0byBcImhlYWRsaW5lXCIgd2hpY2ggY29uZnVzZXMgUmVhZGFiaWxpdHkuIFNvIHdlIHRyeSB0byBjaGVjayBpZiBlaXRoZXJcbiAgICAgICAgICAgIC8vIFwibmFtZVwiIG9yIFwiaGVhZGxpbmVcIiBjbG9zZWx5IG1hdGNoZXMgdGhlIGh0bWwgdGl0bGUsIGFuZCBpZiBzbywgdXNlIHRoYXQgb25lLiBJZiBub3QsIHRoZW4gd2UgdXNlIFwibmFtZVwiIGJ5IGRlZmF1bHQuXG5cbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuX2dldEFydGljbGVUaXRsZSgpO1xuICAgICAgICAgICAgdmFyIG5hbWVNYXRjaGVzID0gdGhpcy5fdGV4dFNpbWlsYXJpdHkocGFyc2VkLm5hbWUsIHRpdGxlKSA+IDAuNzU7XG4gICAgICAgICAgICB2YXIgaGVhZGxpbmVNYXRjaGVzID1cbiAgICAgICAgICAgICAgdGhpcy5fdGV4dFNpbWlsYXJpdHkocGFyc2VkLmhlYWRsaW5lLCB0aXRsZSkgPiAwLjc1O1xuXG4gICAgICAgICAgICBpZiAoaGVhZGxpbmVNYXRjaGVzICYmICFuYW1lTWF0Y2hlcykge1xuICAgICAgICAgICAgICBtZXRhZGF0YS50aXRsZSA9IHBhcnNlZC5oZWFkbGluZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLnRpdGxlID0gcGFyc2VkLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyc2VkLm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnRpdGxlID0gcGFyc2VkLm5hbWUudHJpbSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcnNlZC5oZWFkbGluZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEudGl0bGUgPSBwYXJzZWQuaGVhZGxpbmUudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyc2VkLmF1dGhvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZWQuYXV0aG9yLm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEuYnlsaW5lID0gcGFyc2VkLmF1dGhvci5uYW1lLnRyaW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkocGFyc2VkLmF1dGhvcikgJiZcbiAgICAgICAgICAgICAgcGFyc2VkLmF1dGhvclswXSAmJlxuICAgICAgICAgICAgICB0eXBlb2YgcGFyc2VkLmF1dGhvclswXS5uYW1lID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEuYnlsaW5lID0gcGFyc2VkLmF1dGhvclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGF1dGhvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGhvciAmJiB0eXBlb2YgYXV0aG9yLm5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChhdXRob3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhdXRob3IubmFtZS50cmltKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlZC5kZXNjcmlwdGlvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEuZXhjZXJwdCA9IHBhcnNlZC5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXJzZWQucHVibGlzaGVyICYmIHR5cGVvZiBwYXJzZWQucHVibGlzaGVyLm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnNpdGVOYW1lID0gcGFyc2VkLnB1Ymxpc2hlci5uYW1lLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZWQuZGF0ZVB1Ymxpc2hlZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEuZGF0ZVB1Ymxpc2hlZCA9IHBhcnNlZC5kYXRlUHVibGlzaGVkLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtZXRhZGF0YSA/IG1ldGFkYXRhIDoge307XG4gIH0sXG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIGdldCBleGNlcnB0IGFuZCBieWxpbmUgbWV0YWRhdGEgZm9yIHRoZSBhcnRpY2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0ganNvbmxkIOKAlCBvYmplY3QgY29udGFpbmluZyBhbnkgbWV0YWRhdGEgdGhhdFxuICAgKiBjb3VsZCBiZSBleHRyYWN0ZWQgZnJvbSBKU09OLUxEIG9iamVjdC5cbiAgICpcbiAgICogQHJldHVybiBPYmplY3Qgd2l0aCBvcHRpb25hbCBcImV4Y2VycHRcIiBhbmQgXCJieWxpbmVcIiBwcm9wZXJ0aWVzXG4gICAqL1xuICBfZ2V0QXJ0aWNsZU1ldGFkYXRhKGpzb25sZCkge1xuICAgIHZhciBtZXRhZGF0YSA9IHt9O1xuICAgIHZhciB2YWx1ZXMgPSB7fTtcbiAgICB2YXIgbWV0YUVsZW1lbnRzID0gdGhpcy5fZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibWV0YVwiKTtcblxuICAgIC8vIHByb3BlcnR5IGlzIGEgc3BhY2Utc2VwYXJhdGVkIGxpc3Qgb2YgdmFsdWVzXG4gICAgdmFyIHByb3BlcnR5UGF0dGVybiA9XG4gICAgICAvXFxzKihhcnRpY2xlfGRjfGRjdGVybXxvZ3x0d2l0dGVyKVxccyo6XFxzKihhdXRob3J8Y3JlYXRvcnxkZXNjcmlwdGlvbnxwdWJsaXNoZWRfdGltZXx0aXRsZXxzaXRlX25hbWUpXFxzKi9naTtcblxuICAgIC8vIG5hbWUgaXMgYSBzaW5nbGUgdmFsdWVcbiAgICB2YXIgbmFtZVBhdHRlcm4gPVxuICAgICAgL15cXHMqKD86KGRjfGRjdGVybXxvZ3x0d2l0dGVyfHBhcnNlbHl8d2VpYm86KGFydGljbGV8d2VicGFnZSkpXFxzKlstXFwuOl1cXHMqKT8oYXV0aG9yfGNyZWF0b3J8cHViLWRhdGV8ZGVzY3JpcHRpb258dGl0bGV8c2l0ZV9uYW1lKVxccyokL2k7XG5cbiAgICAvLyBGaW5kIGRlc2NyaXB0aW9uIHRhZ3MuXG4gICAgdGhpcy5fZm9yRWFjaE5vZGUobWV0YUVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgdmFyIGVsZW1lbnROYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgICAgdmFyIGVsZW1lbnRQcm9wZXJ0eSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicHJvcGVydHlcIik7XG4gICAgICB2YXIgY29udGVudCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKTtcbiAgICAgIGlmICghY29udGVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWF0Y2hlcyA9IG51bGw7XG4gICAgICB2YXIgbmFtZSA9IG51bGw7XG5cbiAgICAgIGlmIChlbGVtZW50UHJvcGVydHkpIHtcbiAgICAgICAgbWF0Y2hlcyA9IGVsZW1lbnRQcm9wZXJ0eS5tYXRjaChwcm9wZXJ0eVBhdHRlcm4pO1xuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgIC8vIENvbnZlcnQgdG8gbG93ZXJjYXNlLCBhbmQgcmVtb3ZlIGFueSB3aGl0ZXNwYWNlXG4gICAgICAgICAgLy8gc28gd2UgY2FuIG1hdGNoIGJlbG93LlxuICAgICAgICAgIG5hbWUgPSBtYXRjaGVzWzBdLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzL2csIFwiXCIpO1xuICAgICAgICAgIC8vIG11bHRpcGxlIGF1dGhvcnNcbiAgICAgICAgICB2YWx1ZXNbbmFtZV0gPSBjb250ZW50LnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFtYXRjaGVzICYmIGVsZW1lbnROYW1lICYmIG5hbWVQYXR0ZXJuLnRlc3QoZWxlbWVudE5hbWUpKSB7XG4gICAgICAgIG5hbWUgPSBlbGVtZW50TmFtZTtcbiAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IHRvIGxvd2VyY2FzZSwgcmVtb3ZlIGFueSB3aGl0ZXNwYWNlLCBhbmQgY29udmVydCBkb3RzXG4gICAgICAgICAgLy8gdG8gY29sb25zIHNvIHdlIGNhbiBtYXRjaCBiZWxvdy5cbiAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccy9nLCBcIlwiKS5yZXBsYWNlKC9cXC4vZywgXCI6XCIpO1xuICAgICAgICAgIHZhbHVlc1tuYW1lXSA9IGNvbnRlbnQudHJpbSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBnZXQgdGl0bGVcbiAgICBtZXRhZGF0YS50aXRsZSA9XG4gICAgICBqc29ubGQudGl0bGUgfHxcbiAgICAgIHZhbHVlc1tcImRjOnRpdGxlXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJkY3Rlcm06dGl0bGVcIl0gfHxcbiAgICAgIHZhbHVlc1tcIm9nOnRpdGxlXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJ3ZWlibzphcnRpY2xlOnRpdGxlXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJ3ZWlibzp3ZWJwYWdlOnRpdGxlXCJdIHx8XG4gICAgICB2YWx1ZXMudGl0bGUgfHxcbiAgICAgIHZhbHVlc1tcInR3aXR0ZXI6dGl0bGVcIl0gfHxcbiAgICAgIHZhbHVlc1tcInBhcnNlbHktdGl0bGVcIl07XG5cbiAgICBpZiAoIW1ldGFkYXRhLnRpdGxlKSB7XG4gICAgICBtZXRhZGF0YS50aXRsZSA9IHRoaXMuX2dldEFydGljbGVUaXRsZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGFydGljbGVBdXRob3IgPVxuICAgICAgdHlwZW9mIHZhbHVlc1tcImFydGljbGU6YXV0aG9yXCJdID09PSBcInN0cmluZ1wiICYmXG4gICAgICAhdGhpcy5faXNVcmwodmFsdWVzW1wiYXJ0aWNsZTphdXRob3JcIl0pXG4gICAgICAgID8gdmFsdWVzW1wiYXJ0aWNsZTphdXRob3JcIl1cbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBnZXQgYXV0aG9yXG4gICAgbWV0YWRhdGEuYnlsaW5lID1cbiAgICAgIGpzb25sZC5ieWxpbmUgfHxcbiAgICAgIHZhbHVlc1tcImRjOmNyZWF0b3JcIl0gfHxcbiAgICAgIHZhbHVlc1tcImRjdGVybTpjcmVhdG9yXCJdIHx8XG4gICAgICB2YWx1ZXMuYXV0aG9yIHx8XG4gICAgICB2YWx1ZXNbXCJwYXJzZWx5LWF1dGhvclwiXSB8fFxuICAgICAgYXJ0aWNsZUF1dGhvcjtcblxuICAgIC8vIGdldCBkZXNjcmlwdGlvblxuICAgIG1ldGFkYXRhLmV4Y2VycHQgPVxuICAgICAganNvbmxkLmV4Y2VycHQgfHxcbiAgICAgIHZhbHVlc1tcImRjOmRlc2NyaXB0aW9uXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJkY3Rlcm06ZGVzY3JpcHRpb25cIl0gfHxcbiAgICAgIHZhbHVlc1tcIm9nOmRlc2NyaXB0aW9uXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJ3ZWlibzphcnRpY2xlOmRlc2NyaXB0aW9uXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJ3ZWlibzp3ZWJwYWdlOmRlc2NyaXB0aW9uXCJdIHx8XG4gICAgICB2YWx1ZXMuZGVzY3JpcHRpb24gfHxcbiAgICAgIHZhbHVlc1tcInR3aXR0ZXI6ZGVzY3JpcHRpb25cIl07XG5cbiAgICAvLyBnZXQgc2l0ZSBuYW1lXG4gICAgbWV0YWRhdGEuc2l0ZU5hbWUgPSBqc29ubGQuc2l0ZU5hbWUgfHwgdmFsdWVzW1wib2c6c2l0ZV9uYW1lXCJdO1xuXG4gICAgLy8gZ2V0IGFydGljbGUgcHVibGlzaGVkIHRpbWVcbiAgICBtZXRhZGF0YS5wdWJsaXNoZWRUaW1lID1cbiAgICAgIGpzb25sZC5kYXRlUHVibGlzaGVkIHx8XG4gICAgICB2YWx1ZXNbXCJhcnRpY2xlOnB1Ymxpc2hlZF90aW1lXCJdIHx8XG4gICAgICB2YWx1ZXNbXCJwYXJzZWx5LXB1Yi1kYXRlXCJdIHx8XG4gICAgICBudWxsO1xuXG4gICAgLy8gaW4gbWFueSBzaXRlcyB0aGUgbWV0YSB2YWx1ZSBpcyBlc2NhcGVkIHdpdGggSFRNTCBlbnRpdGllcyxcbiAgICAvLyBzbyBoZXJlIHdlIG5lZWQgdG8gdW5lc2NhcGUgaXRcbiAgICBtZXRhZGF0YS50aXRsZSA9IHRoaXMuX3VuZXNjYXBlSHRtbEVudGl0aWVzKG1ldGFkYXRhLnRpdGxlKTtcbiAgICBtZXRhZGF0YS5ieWxpbmUgPSB0aGlzLl91bmVzY2FwZUh0bWxFbnRpdGllcyhtZXRhZGF0YS5ieWxpbmUpO1xuICAgIG1ldGFkYXRhLmV4Y2VycHQgPSB0aGlzLl91bmVzY2FwZUh0bWxFbnRpdGllcyhtZXRhZGF0YS5leGNlcnB0KTtcbiAgICBtZXRhZGF0YS5zaXRlTmFtZSA9IHRoaXMuX3VuZXNjYXBlSHRtbEVudGl0aWVzKG1ldGFkYXRhLnNpdGVOYW1lKTtcbiAgICBtZXRhZGF0YS5wdWJsaXNoZWRUaW1lID0gdGhpcy5fdW5lc2NhcGVIdG1sRW50aXRpZXMobWV0YWRhdGEucHVibGlzaGVkVGltZSk7XG5cbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIG5vZGUgaXMgaW1hZ2UsIG9yIGlmIG5vZGUgY29udGFpbnMgZXhhY3RseSBvbmx5IG9uZSBpbWFnZVxuICAgKiB3aGV0aGVyIGFzIGEgZGlyZWN0IGNoaWxkIG9yIGFzIGl0cyBkZXNjZW5kYW50cy5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICoqL1xuICBfaXNTaW5nbGVJbWFnZShub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLnRhZ05hbWUgPT09IFwiSU1HXCIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggIT09IDEgfHwgbm9kZS50ZXh0Q29udGVudC50cmltKCkgIT09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogRmluZCBhbGwgPG5vc2NyaXB0PiB0aGF0IGFyZSBsb2NhdGVkIGFmdGVyIDxpbWc+IG5vZGVzLCBhbmQgd2hpY2ggY29udGFpbiBvbmx5IG9uZVxuICAgKiA8aW1nPiBlbGVtZW50LiBSZXBsYWNlIHRoZSBmaXJzdCBpbWFnZSB3aXRoIHRoZSBpbWFnZSBmcm9tIGluc2lkZSB0aGUgPG5vc2NyaXB0PiB0YWcsXG4gICAqIGFuZCByZW1vdmUgdGhlIDxub3NjcmlwdD4gdGFnLiBUaGlzIGltcHJvdmVzIHRoZSBxdWFsaXR5IG9mIHRoZSBpbWFnZXMgd2UgdXNlIG9uXG4gICAqIHNvbWUgc2l0ZXMgKGUuZy4gTWVkaXVtKS5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICoqL1xuICBfdW53cmFwTm9zY3JpcHRJbWFnZXMoZG9jKSB7XG4gICAgLy8gRmluZCBpbWcgd2l0aG91dCBzb3VyY2Ugb3IgYXR0cmlidXRlcyB0aGF0IG1pZ2h0IGNvbnRhaW5zIGltYWdlLCBhbmQgcmVtb3ZlIGl0LlxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byBwcmV2ZW50IGEgcGxhY2Vob2xkZXIgaW1nIGlzIHJlcGxhY2VkIGJ5IGltZyBmcm9tIG5vc2NyaXB0IGluIG5leHQgc3RlcC5cbiAgICB2YXIgaW1ncyA9IEFycmF5LmZyb20oZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpKTtcbiAgICB0aGlzLl9mb3JFYWNoTm9kZShpbWdzLCBmdW5jdGlvbiAoaW1nKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltZy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyID0gaW1nLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIHN3aXRjaCAoYXR0ci5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBcInNyY1wiOlxuICAgICAgICAgIGNhc2UgXCJzcmNzZXRcIjpcbiAgICAgICAgICBjYXNlIFwiZGF0YS1zcmNcIjpcbiAgICAgICAgICBjYXNlIFwiZGF0YS1zcmNzZXRcIjpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvXFwuKGpwZ3xqcGVnfHBuZ3x3ZWJwKS9pLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW1nLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gTmV4dCBmaW5kIG5vc2NyaXB0IGFuZCB0cnkgdG8gZXh0cmFjdCBpdHMgaW1hZ2VcbiAgICB2YXIgbm9zY3JpcHRzID0gQXJyYXkuZnJvbShkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJub3NjcmlwdFwiKSk7XG4gICAgdGhpcy5fZm9yRWFjaE5vZGUobm9zY3JpcHRzLCBmdW5jdGlvbiAobm9zY3JpcHQpIHtcbiAgICAgIC8vIFBhcnNlIGNvbnRlbnQgb2Ygbm9zY3JpcHQgYW5kIG1ha2Ugc3VyZSBpdCBvbmx5IGNvbnRhaW5zIGltYWdlXG4gICAgICBpZiAoIXRoaXMuX2lzU2luZ2xlSW1hZ2Uobm9zY3JpcHQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB0bXAgPSBkb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgaW4gdGhlIGRvY3VtZW50IGNvbnRleHQsIGFuZCB1c2luZyB1bm1vZGlmaWVkXG4gICAgICAvLyBkb2N1bWVudCBjb250ZW50cywgc28gZG9pbmcgdGhpcyBzaG91bGQgYmUgc2FmZS5cbiAgICAgIC8vIChBbHNvIHdlIGhlYXZpbHkgZGlzY291cmFnZSBwZW9wbGUgZnJvbSBhbGxvd2luZyBzY3JpcHQgdG9cbiAgICAgIC8vIHJ1biBhdCBhbGwgaW4gdGhpcyBkb2N1bWVudC4uLilcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnNhbml0aXplZC9wcm9wZXJ0eVxuICAgICAgdG1wLmlubmVySFRNTCA9IG5vc2NyaXB0LmlubmVySFRNTDtcblxuICAgICAgLy8gSWYgbm9zY3JpcHQgaGFzIHByZXZpb3VzIHNpYmxpbmcgYW5kIGl0IG9ubHkgY29udGFpbnMgaW1hZ2UsXG4gICAgICAvLyByZXBsYWNlIGl0IHdpdGggbm9zY3JpcHQgY29udGVudC4gSG93ZXZlciB3ZSBhbHNvIGtlZXAgb2xkXG4gICAgICAvLyBhdHRyaWJ1dGVzIHRoYXQgbWlnaHQgY29udGFpbnMgaW1hZ2UuXG4gICAgICB2YXIgcHJldkVsZW1lbnQgPSBub3NjcmlwdC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgaWYgKHByZXZFbGVtZW50ICYmIHRoaXMuX2lzU2luZ2xlSW1hZ2UocHJldkVsZW1lbnQpKSB7XG4gICAgICAgIHZhciBwcmV2SW1nID0gcHJldkVsZW1lbnQ7XG4gICAgICAgIGlmIChwcmV2SW1nLnRhZ05hbWUgIT09IFwiSU1HXCIpIHtcbiAgICAgICAgICBwcmV2SW1nID0gcHJldkVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilbMF07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3SW1nID0gdG1wLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpWzBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXZJbWcuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBhdHRyID0gcHJldkltZy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgIGlmIChhdHRyLnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBhdHRyLm5hbWUgPT09IFwic3JjXCIgfHxcbiAgICAgICAgICAgIGF0dHIubmFtZSA9PT0gXCJzcmNzZXRcIiB8fFxuICAgICAgICAgICAgL1xcLihqcGd8anBlZ3xwbmd8d2VicCkvaS50ZXN0KGF0dHIudmFsdWUpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAobmV3SW1nLmdldEF0dHJpYnV0ZShhdHRyLm5hbWUpID09PSBhdHRyLnZhbHVlKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgICAgICBpZiAobmV3SW1nLmhhc0F0dHJpYnV0ZShhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgYXR0ck5hbWUgPSBcImRhdGEtb2xkLVwiICsgYXR0ck5hbWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ld0ltZy5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHIudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5vc2NyaXB0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRtcC5maXJzdEVsZW1lbnRDaGlsZCwgcHJldkVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHNjcmlwdCB0YWdzIGZyb20gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiovXG4gIF9yZW1vdmVTY3JpcHRzKGRvYykge1xuICAgIHRoaXMuX3JlbW92ZU5vZGVzKHRoaXMuX2dldEFsbE5vZGVzV2l0aFRhZyhkb2MsIFtcInNjcmlwdFwiLCBcIm5vc2NyaXB0XCJdKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgbm9kZSBoYXMgb25seSB3aGl0ZXNwYWNlIGFuZCBhIHNpbmdsZSBlbGVtZW50IHdpdGggZ2l2ZW4gdGFnXG4gICAqIFJldHVybnMgZmFsc2UgaWYgdGhlIERJViBub2RlIGNvbnRhaW5zIG5vbi1lbXB0eSB0ZXh0IG5vZGVzXG4gICAqIG9yIGlmIGl0IGNvbnRhaW5zIG5vIGVsZW1lbnQgd2l0aCBnaXZlbiB0YWcgb3IgbW9yZSB0aGFuIDEgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHBhcmFtIHN0cmluZyB0YWcgb2YgY2hpbGQgZWxlbWVudFxuICAgKiovXG4gIF9oYXNTaW5nbGVUYWdJbnNpZGVFbGVtZW50KGVsZW1lbnQsIHRhZykge1xuICAgIC8vIFRoZXJlIHNob3VsZCBiZSBleGFjdGx5IDEgZWxlbWVudCBjaGlsZCB3aXRoIGdpdmVuIHRhZ1xuICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCAhPSAxIHx8IGVsZW1lbnQuY2hpbGRyZW5bMF0udGFnTmFtZSAhPT0gdGFnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQW5kIHRoZXJlIHNob3VsZCBiZSBubyB0ZXh0IG5vZGVzIHdpdGggcmVhbCBjb250ZW50XG4gICAgcmV0dXJuICF0aGlzLl9zb21lTm9kZShlbGVtZW50LmNoaWxkTm9kZXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBub2RlLm5vZGVUeXBlID09PSB0aGlzLlRFWFRfTk9ERSAmJlxuICAgICAgICB0aGlzLlJFR0VYUFMuaGFzQ29udGVudC50ZXN0KG5vZGUudGV4dENvbnRlbnQpXG4gICAgICApO1xuICAgIH0pO1xuICB9LFxuXG4gIF9pc0VsZW1lbnRXaXRob3V0Q29udGVudChub2RlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG5vZGUubm9kZVR5cGUgPT09IHRoaXMuRUxFTUVOVF9OT0RFICYmXG4gICAgICAhbm9kZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoICYmXG4gICAgICAoIW5vZGUuY2hpbGRyZW4ubGVuZ3RoIHx8XG4gICAgICAgIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09XG4gICAgICAgICAgbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJyXCIpLmxlbmd0aCArXG4gICAgICAgICAgICBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaHJcIikubGVuZ3RoKVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERldGVybWluZSB3aGV0aGVyIGVsZW1lbnQgaGFzIGFueSBjaGlsZHJlbiBibG9jayBsZXZlbCBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICovXG4gIF9oYXNDaGlsZEJsb2NrRWxlbWVudChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvbWVOb2RlKGVsZW1lbnQuY2hpbGROb2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuRElWX1RPX1BfRUxFTVMuaGFzKG5vZGUudGFnTmFtZSkgfHxcbiAgICAgICAgdGhpcy5faGFzQ2hpbGRCbG9ja0VsZW1lbnQobm9kZSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqKlxuICAgKiBEZXRlcm1pbmUgaWYgYSBub2RlIHF1YWxpZmllcyBhcyBwaHJhc2luZyBjb250ZW50LlxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9HdWlkZS9IVE1ML0NvbnRlbnRfY2F0ZWdvcmllcyNQaHJhc2luZ19jb250ZW50XG4gICAqKi9cbiAgX2lzUGhyYXNpbmdDb250ZW50KG5vZGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gdGhpcy5URVhUX05PREUgfHxcbiAgICAgIHRoaXMuUEhSQVNJTkdfRUxFTVMuaW5jbHVkZXMobm9kZS50YWdOYW1lKSB8fFxuICAgICAgKChub2RlLnRhZ05hbWUgPT09IFwiQVwiIHx8XG4gICAgICAgIG5vZGUudGFnTmFtZSA9PT0gXCJERUxcIiB8fFxuICAgICAgICBub2RlLnRhZ05hbWUgPT09IFwiSU5TXCIpICYmXG4gICAgICAgIHRoaXMuX2V2ZXJ5Tm9kZShub2RlLmNoaWxkTm9kZXMsIHRoaXMuX2lzUGhyYXNpbmdDb250ZW50KSlcbiAgICApO1xuICB9LFxuXG4gIF9pc1doaXRlc3BhY2Uobm9kZSkge1xuICAgIHJldHVybiAoXG4gICAgICAobm9kZS5ub2RlVHlwZSA9PT0gdGhpcy5URVhUX05PREUgJiZcbiAgICAgICAgbm9kZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID09PSAwKSB8fFxuICAgICAgKG5vZGUubm9kZVR5cGUgPT09IHRoaXMuRUxFTUVOVF9OT0RFICYmIG5vZGUudGFnTmFtZSA9PT0gXCJCUlwiKVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaW5uZXIgdGV4dCBvZiBhIG5vZGUgLSBjcm9zcyBicm93c2VyIGNvbXBhdGlibHkuXG4gICAqIFRoaXMgYWxzbyBzdHJpcHMgb3V0IGFueSBleGNlc3Mgd2hpdGVzcGFjZSB0byBiZSBmb3VuZC5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHBhcmFtIEJvb2xlYW4gbm9ybWFsaXplU3BhY2VzIChkZWZhdWx0OiB0cnVlKVxuICAgKiBAcmV0dXJuIHN0cmluZ1xuICAgKiovXG4gIF9nZXRJbm5lclRleHQoZSwgbm9ybWFsaXplU3BhY2VzKSB7XG4gICAgbm9ybWFsaXplU3BhY2VzID1cbiAgICAgIHR5cGVvZiBub3JtYWxpemVTcGFjZXMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogbm9ybWFsaXplU3BhY2VzO1xuICAgIHZhciB0ZXh0Q29udGVudCA9IGUudGV4dENvbnRlbnQudHJpbSgpO1xuXG4gICAgaWYgKG5vcm1hbGl6ZVNwYWNlcykge1xuICAgICAgcmV0dXJuIHRleHRDb250ZW50LnJlcGxhY2UodGhpcy5SRUdFWFBTLm5vcm1hbGl6ZSwgXCIgXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dENvbnRlbnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRpbWVzIGEgc3RyaW5nIHMgYXBwZWFycyBpbiB0aGUgbm9kZSBlLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcGFyYW0gc3RyaW5nIC0gd2hhdCB0byBzcGxpdCBvbi4gRGVmYXVsdCBpcyBcIixcIlxuICAgKiBAcmV0dXJuIG51bWJlciAoaW50ZWdlcilcbiAgICoqL1xuICBfZ2V0Q2hhckNvdW50KGUsIHMpIHtcbiAgICBzID0gcyB8fCBcIixcIjtcbiAgICByZXR1cm4gdGhpcy5fZ2V0SW5uZXJUZXh0KGUpLnNwbGl0KHMpLmxlbmd0aCAtIDE7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgc3R5bGUgYXR0cmlidXRlIG9uIGV2ZXJ5IGUgYW5kIHVuZGVyLlxuICAgKiBUT0RPOiBUZXN0IGlmIGdldEVsZW1lbnRzQnlUYWdOYW1lKCopIGlzIGZhc3Rlci5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgX2NsZWFuU3R5bGVzKGUpIHtcbiAgICBpZiAoIWUgfHwgZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic3ZnXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYHN0eWxlYCBhbmQgZGVwcmVjYXRlZCBwcmVzZW50YXRpb25hbCBhdHRyaWJ1dGVzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLlBSRVNFTlRBVElPTkFMX0FUVFJJQlVURVMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUucmVtb3ZlQXR0cmlidXRlKHRoaXMuUFJFU0VOVEFUSU9OQUxfQVRUUklCVVRFU1tpXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuREVQUkVDQVRFRF9TSVpFX0FUVFJJQlVURV9FTEVNUy5pbmNsdWRlcyhlLnRhZ05hbWUpKSB7XG4gICAgICBlLnJlbW92ZUF0dHJpYnV0ZShcIndpZHRoXCIpO1xuICAgICAgZS5yZW1vdmVBdHRyaWJ1dGUoXCJoZWlnaHRcIik7XG4gICAgfVxuXG4gICAgdmFyIGN1ciA9IGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgd2hpbGUgKGN1ciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY2xlYW5TdHlsZXMoY3VyKTtcbiAgICAgIGN1ciA9IGN1ci5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlbnNpdHkgb2YgbGlua3MgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBjb250ZW50XG4gICAqIFRoaXMgaXMgdGhlIGFtb3VudCBvZiB0ZXh0IHRoYXQgaXMgaW5zaWRlIGEgbGluayBkaXZpZGVkIGJ5IHRoZSB0b3RhbCB0ZXh0IGluIHRoZSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcmV0dXJuIG51bWJlciAoZmxvYXQpXG4gICAqKi9cbiAgX2dldExpbmtEZW5zaXR5KGVsZW1lbnQpIHtcbiAgICB2YXIgdGV4dExlbmd0aCA9IHRoaXMuX2dldElubmVyVGV4dChlbGVtZW50KS5sZW5ndGg7XG4gICAgaWYgKHRleHRMZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHZhciBsaW5rTGVuZ3RoID0gMDtcblxuICAgIC8vIFhYWCBpbXBsZW1lbnQgX3JlZHVjZU5vZGVMaXN0P1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpLCBmdW5jdGlvbiAobGlua05vZGUpIHtcbiAgICAgIHZhciBocmVmID0gbGlua05vZGUuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgICAgIHZhciBjb2VmZmljaWVudCA9IGhyZWYgJiYgdGhpcy5SRUdFWFBTLmhhc2hVcmwudGVzdChocmVmKSA/IDAuMyA6IDE7XG4gICAgICBsaW5rTGVuZ3RoICs9IHRoaXMuX2dldElubmVyVGV4dChsaW5rTm9kZSkubGVuZ3RoICogY29lZmZpY2llbnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGlua0xlbmd0aCAvIHRleHRMZW5ndGg7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhbiBlbGVtZW50cyBjbGFzcy9pZCB3ZWlnaHQuIFVzZXMgcmVndWxhciBleHByZXNzaW9ucyB0byB0ZWxsIGlmIHRoaXNcbiAgICogZWxlbWVudCBsb29rcyBnb29kIG9yIGJhZC5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHJldHVybiBudW1iZXIgKEludGVnZXIpXG4gICAqKi9cbiAgX2dldENsYXNzV2VpZ2h0KGUpIHtcbiAgICBpZiAoIXRoaXMuX2ZsYWdJc0FjdGl2ZSh0aGlzLkZMQUdfV0VJR0hUX0NMQVNTRVMpKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgd2VpZ2h0ID0gMDtcblxuICAgIC8vIExvb2sgZm9yIGEgc3BlY2lhbCBjbGFzc25hbWVcbiAgICBpZiAodHlwZW9mIGUuY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGUuY2xhc3NOYW1lICE9PSBcIlwiKSB7XG4gICAgICBpZiAodGhpcy5SRUdFWFBTLm5lZ2F0aXZlLnRlc3QoZS5jbGFzc05hbWUpKSB7XG4gICAgICAgIHdlaWdodCAtPSAyNTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuUkVHRVhQUy5wb3NpdGl2ZS50ZXN0KGUuY2xhc3NOYW1lKSkge1xuICAgICAgICB3ZWlnaHQgKz0gMjU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTG9vayBmb3IgYSBzcGVjaWFsIElEXG4gICAgaWYgKHR5cGVvZiBlLmlkID09PSBcInN0cmluZ1wiICYmIGUuaWQgIT09IFwiXCIpIHtcbiAgICAgIGlmICh0aGlzLlJFR0VYUFMubmVnYXRpdmUudGVzdChlLmlkKSkge1xuICAgICAgICB3ZWlnaHQgLT0gMjU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLlJFR0VYUFMucG9zaXRpdmUudGVzdChlLmlkKSkge1xuICAgICAgICB3ZWlnaHQgKz0gMjU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdlaWdodDtcbiAgfSxcblxuICAvKipcbiAgICogQ2xlYW4gYSBub2RlIG9mIGFsbCBlbGVtZW50cyBvZiB0eXBlIFwidGFnXCIuXG4gICAqIChVbmxlc3MgaXQncyBhIHlvdXR1YmUvdmltZW8gdmlkZW8uIFBlb3BsZSBsb3ZlIG1vdmllcy4pXG4gICAqXG4gICAqIEBwYXJhbSBFbGVtZW50XG4gICAqIEBwYXJhbSBzdHJpbmcgdGFnIHRvIGNsZWFuXG4gICAqIEByZXR1cm4gdm9pZFxuICAgKiovXG4gIF9jbGVhbihlLCB0YWcpIHtcbiAgICB2YXIgaXNFbWJlZCA9IFtcIm9iamVjdFwiLCBcImVtYmVkXCIsIFwiaWZyYW1lXCJdLmluY2x1ZGVzKHRhZyk7XG5cbiAgICB0aGlzLl9yZW1vdmVOb2Rlcyh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZSwgW3RhZ10pLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgLy8gQWxsb3cgeW91dHViZSBhbmQgdmltZW8gdmlkZW9zIHRocm91Z2ggYXMgcGVvcGxlIHVzdWFsbHkgd2FudCB0byBzZWUgdGhvc2UuXG4gICAgICBpZiAoaXNFbWJlZCkge1xuICAgICAgICAvLyBGaXJzdCwgY2hlY2sgdGhlIGVsZW1lbnRzIGF0dHJpYnV0ZXMgdG8gc2VlIGlmIGFueSBvZiB0aGVtIGNvbnRhaW4geW91dHViZSBvciB2aW1lb1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLl9hbGxvd2VkVmlkZW9SZWdleC50ZXN0KGVsZW1lbnQuYXR0cmlidXRlc1tpXS52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgZW1iZWQgd2l0aCA8b2JqZWN0PiB0YWcsIGNoZWNrIGlubmVyIEhUTUwgYXMgd2VsbC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVsZW1lbnQudGFnTmFtZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIHRoaXMuX2FsbG93ZWRWaWRlb1JlZ2V4LnRlc3QoZWxlbWVudC5pbm5lckhUTUwpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBnaXZlbiBub2RlIGhhcyBvbmUgb2YgaXRzIGFuY2VzdG9yIHRhZyBuYW1lIG1hdGNoaW5nIHRoZVxuICAgKiBwcm92aWRlZCBvbmUuXG4gICAqIEBwYXJhbSAgSFRNTEVsZW1lbnQgbm9kZVxuICAgKiBAcGFyYW0gIFN0cmluZyAgICAgIHRhZ05hbWVcbiAgICogQHBhcmFtICBOdW1iZXIgICAgICBtYXhEZXB0aFxuICAgKiBAcGFyYW0gIEZ1bmN0aW9uICAgIGZpbHRlckZuIGEgZmlsdGVyIHRvIGludm9rZSB0byBkZXRlcm1pbmUgd2hldGhlciB0aGlzIG5vZGUgJ2NvdW50cydcbiAgICogQHJldHVybiBCb29sZWFuXG4gICAqL1xuICBfaGFzQW5jZXN0b3JUYWcobm9kZSwgdGFnTmFtZSwgbWF4RGVwdGgsIGZpbHRlckZuKSB7XG4gICAgbWF4RGVwdGggPSBtYXhEZXB0aCB8fCAzO1xuICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgdmFyIGRlcHRoID0gMDtcbiAgICB3aGlsZSAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICBpZiAobWF4RGVwdGggPiAwICYmIGRlcHRoID4gbWF4RGVwdGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBub2RlLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gdGFnTmFtZSAmJlxuICAgICAgICAoIWZpbHRlckZuIHx8IGZpbHRlckZuKG5vZGUucGFyZW50Tm9kZSkpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgZGVwdGgrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gb2JqZWN0IGluZGljYXRpbmcgaG93IG1hbnkgcm93cyBhbmQgY29sdW1ucyB0aGlzIHRhYmxlIGhhcy5cbiAgICovXG4gIF9nZXRSb3dBbmRDb2x1bW5Db3VudCh0YWJsZSkge1xuICAgIHZhciByb3dzID0gMDtcbiAgICB2YXIgY29sdW1ucyA9IDA7XG4gICAgdmFyIHRycyA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByb3dzcGFuID0gdHJzW2ldLmdldEF0dHJpYnV0ZShcInJvd3NwYW5cIikgfHwgMDtcbiAgICAgIGlmIChyb3dzcGFuKSB7XG4gICAgICAgIHJvd3NwYW4gPSBwYXJzZUludChyb3dzcGFuLCAxMCk7XG4gICAgICB9XG4gICAgICByb3dzICs9IHJvd3NwYW4gfHwgMTtcblxuICAgICAgLy8gTm93IGxvb2sgZm9yIGNvbHVtbi1yZWxhdGVkIGluZm9cbiAgICAgIHZhciBjb2x1bW5zSW5UaGlzUm93ID0gMDtcbiAgICAgIHZhciBjZWxscyA9IHRyc1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjZWxscy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgY29sc3BhbiA9IGNlbGxzW2pdLmdldEF0dHJpYnV0ZShcImNvbHNwYW5cIikgfHwgMDtcbiAgICAgICAgaWYgKGNvbHNwYW4pIHtcbiAgICAgICAgICBjb2xzcGFuID0gcGFyc2VJbnQoY29sc3BhbiwgMTApO1xuICAgICAgICB9XG4gICAgICAgIGNvbHVtbnNJblRoaXNSb3cgKz0gY29sc3BhbiB8fCAxO1xuICAgICAgfVxuICAgICAgY29sdW1ucyA9IE1hdGgubWF4KGNvbHVtbnMsIGNvbHVtbnNJblRoaXNSb3cpO1xuICAgIH1cbiAgICByZXR1cm4geyByb3dzLCBjb2x1bW5zIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIExvb2sgZm9yICdkYXRhJyAoYXMgb3Bwb3NlZCB0byAnbGF5b3V0JykgdGFibGVzLCBmb3Igd2hpY2ggd2UgdXNlXG4gICAqIHNpbWlsYXIgY2hlY2tzIGFzXG4gICAqIGh0dHBzOi8vc2VhcmNoZm94Lm9yZy9tb3ppbGxhLWNlbnRyYWwvcmV2L2Y4MmQ1YzU0OWYwNDZjYjY0Y2U1NjAyYmZkODk0YjdhZTgwN2M4ZjgvYWNjZXNzaWJsZS9nZW5lcmljL1RhYmxlQWNjZXNzaWJsZS5jcHAjMTlcbiAgICovXG4gIF9tYXJrRGF0YVRhYmxlcyhyb290KSB7XG4gICAgdmFyIHRhYmxlcyA9IHJvb3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0YWJsZVwiKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRhYmxlID0gdGFibGVzW2ldO1xuICAgICAgdmFyIHJvbGUgPSB0YWJsZS5nZXRBdHRyaWJ1dGUoXCJyb2xlXCIpO1xuICAgICAgaWYgKHJvbGUgPT0gXCJwcmVzZW50YXRpb25cIikge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgZGF0YXRhYmxlID0gdGFibGUuZ2V0QXR0cmlidXRlKFwiZGF0YXRhYmxlXCIpO1xuICAgICAgaWYgKGRhdGF0YWJsZSA9PSBcIjBcIikge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgc3VtbWFyeSA9IHRhYmxlLmdldEF0dHJpYnV0ZShcInN1bW1hcnlcIik7XG4gICAgICBpZiAoc3VtbWFyeSkge1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhcHRpb24gPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImNhcHRpb25cIilbMF07XG4gICAgICBpZiAoY2FwdGlvbiAmJiBjYXB0aW9uLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIHRhYmxlLl9yZWFkYWJpbGl0eURhdGFUYWJsZSA9IHRydWU7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgdGFibGUgaGFzIGEgZGVzY2VuZGFudCB3aXRoIGFueSBvZiB0aGVzZSB0YWdzLCBjb25zaWRlciBhIGRhdGEgdGFibGU6XG4gICAgICB2YXIgZGF0YVRhYmxlRGVzY2VuZGFudHMgPSBbXCJjb2xcIiwgXCJjb2xncm91cFwiLCBcInRmb290XCIsIFwidGhlYWRcIiwgXCJ0aFwiXTtcbiAgICAgIHZhciBkZXNjZW5kYW50RXhpc3RzID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgICByZXR1cm4gISF0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpWzBdO1xuICAgICAgfTtcbiAgICAgIGlmIChkYXRhVGFibGVEZXNjZW5kYW50cy5zb21lKGRlc2NlbmRhbnRFeGlzdHMpKSB7XG4gICAgICAgIHRoaXMubG9nKFwiRGF0YSB0YWJsZSBiZWNhdXNlIGZvdW5kIGRhdGEteSBkZXNjZW5kYW50XCIpO1xuICAgICAgICB0YWJsZS5fcmVhZGFiaWxpdHlEYXRhVGFibGUgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gTmVzdGVkIHRhYmxlcyBpbmRpY2F0ZSBhIGxheW91dCB0YWJsZTpcbiAgICAgIGlmICh0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRhYmxlXCIpWzBdKSB7XG4gICAgICAgIHRhYmxlLl9yZWFkYWJpbGl0eURhdGFUYWJsZSA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNpemVJbmZvID0gdGhpcy5fZ2V0Um93QW5kQ29sdW1uQ291bnQodGFibGUpO1xuXG4gICAgICBpZiAoc2l6ZUluZm8uY29sdW1ucyA9PSAxIHx8IHNpemVJbmZvLnJvd3MgPT0gMSkge1xuICAgICAgICAvLyBzaW5nbGUgY29sdW0vcm93IHRhYmxlcyBhcmUgY29tbW9ubHkgdXNlZCBmb3IgcGFnZSBsYXlvdXQgcHVycG9zZXMuXG4gICAgICAgIHRhYmxlLl9yZWFkYWJpbGl0eURhdGFUYWJsZSA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNpemVJbmZvLnJvd3MgPj0gMTAgfHwgc2l6ZUluZm8uY29sdW1ucyA+IDQpIHtcbiAgICAgICAgdGFibGUuX3JlYWRhYmlsaXR5RGF0YVRhYmxlID0gdHJ1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBOb3cganVzdCBnbyBieSBzaXplIGVudGlyZWx5OlxuICAgICAgdGFibGUuX3JlYWRhYmlsaXR5RGF0YVRhYmxlID0gc2l6ZUluZm8ucm93cyAqIHNpemVJbmZvLmNvbHVtbnMgPiAxMDtcbiAgICB9XG4gIH0sXG5cbiAgLyogY29udmVydCBpbWFnZXMgYW5kIGZpZ3VyZXMgdGhhdCBoYXZlIHByb3BlcnRpZXMgbGlrZSBkYXRhLXNyYyBpbnRvIGltYWdlcyB0aGF0IGNhbiBiZSBsb2FkZWQgd2l0aG91dCBKUyAqL1xuICBfZml4TGF6eUltYWdlcyhyb290KSB7XG4gICAgdGhpcy5fZm9yRWFjaE5vZGUoXG4gICAgICB0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcocm9vdCwgW1wiaW1nXCIsIFwicGljdHVyZVwiLCBcImZpZ3VyZVwiXSksXG4gICAgICBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICAvLyBJbiBzb21lIHNpdGVzIChlLmcuIEtvdGFrdSksIHRoZXkgcHV0IDFweCBzcXVhcmUgaW1hZ2UgYXMgYmFzZTY0IGRhdGEgdXJpIGluIHRoZSBzcmMgYXR0cmlidXRlLlxuICAgICAgICAvLyBTbywgaGVyZSB3ZSBjaGVjayBpZiB0aGUgZGF0YSB1cmkgaXMgdG9vIHNob3J0LCBqdXN0IG1pZ2h0IGFzIHdlbGwgcmVtb3ZlIGl0LlxuICAgICAgICBpZiAoZWxlbS5zcmMgJiYgdGhpcy5SRUdFWFBTLmI2NERhdGFVcmwudGVzdChlbGVtLnNyYykpIHtcbiAgICAgICAgICAvLyBNYWtlIHN1cmUgaXQncyBub3QgU1ZHLCBiZWNhdXNlIFNWRyBjYW4gaGF2ZSBhIG1lYW5pbmdmdWwgaW1hZ2UgaW4gdW5kZXIgMTMzIGJ5dGVzLlxuICAgICAgICAgIHZhciBwYXJ0cyA9IHRoaXMuUkVHRVhQUy5iNjREYXRhVXJsLmV4ZWMoZWxlbS5zcmMpO1xuICAgICAgICAgIGlmIChwYXJ0c1sxXSA9PT0gXCJpbWFnZS9zdmcreG1sXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyBlbGVtZW50IGhhcyBvdGhlciBhdHRyaWJ1dGVzIHdoaWNoIGNvbnRhaW5zIGltYWdlLlxuICAgICAgICAgIC8vIElmIGl0IGRvZXNuJ3QsIHRoZW4gdGhpcyBzcmMgaXMgaW1wb3J0YW50IGFuZCBzaG91bGRuJ3QgYmUgcmVtb3ZlZC5cbiAgICAgICAgICB2YXIgc3JjQ291bGRCZVJlbW92ZWQgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW0uYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSBlbGVtLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICBpZiAoYXR0ci5uYW1lID09PSBcInNyY1wiKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoL1xcLihqcGd8anBlZ3xwbmd8d2VicCkvaS50ZXN0KGF0dHIudmFsdWUpKSB7XG4gICAgICAgICAgICAgIHNyY0NvdWxkQmVSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSGVyZSB3ZSBhc3N1bWUgaWYgaW1hZ2UgaXMgbGVzcyB0aGFuIDEwMCBieXRlcyAob3IgMTMzIGFmdGVyIGVuY29kZWQgdG8gYmFzZTY0KVxuICAgICAgICAgIC8vIGl0IHdpbGwgYmUgdG9vIHNtYWxsLCB0aGVyZWZvcmUgaXQgbWlnaHQgYmUgcGxhY2Vob2xkZXIgaW1hZ2UuXG4gICAgICAgICAgaWYgKHNyY0NvdWxkQmVSZW1vdmVkKSB7XG4gICAgICAgICAgICB2YXIgYjY0c3RhcnRzID0gcGFydHNbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGI2NGxlbmd0aCA9IGVsZW0uc3JjLmxlbmd0aCAtIGI2NHN0YXJ0cztcbiAgICAgICAgICAgIGlmIChiNjRsZW5ndGggPCAxMzMpIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJzcmNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWxzbyBjaGVjayBmb3IgXCJudWxsXCIgdG8gd29yayBhcm91bmQgaHR0cHM6Ly9naXRodWIuY29tL2pzZG9tL2pzZG9tL2lzc3Vlcy8yNTgwXG4gICAgICAgIGlmIChcbiAgICAgICAgICAoZWxlbS5zcmMgfHwgKGVsZW0uc3Jjc2V0ICYmIGVsZW0uc3Jjc2V0ICE9IFwibnVsbFwiKSkgJiZcbiAgICAgICAgICAhZWxlbS5jbGFzc05hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcImxhenlcIilcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBlbGVtLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBhdHRyID0gZWxlbS5hdHRyaWJ1dGVzW2pdO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGF0dHIubmFtZSA9PT0gXCJzcmNcIiB8fFxuICAgICAgICAgICAgYXR0ci5uYW1lID09PSBcInNyY3NldFwiIHx8XG4gICAgICAgICAgICBhdHRyLm5hbWUgPT09IFwiYWx0XCJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgY29weVRvID0gbnVsbDtcbiAgICAgICAgICBpZiAoL1xcLihqcGd8anBlZ3xwbmd8d2VicClcXHMrXFxkLy50ZXN0KGF0dHIudmFsdWUpKSB7XG4gICAgICAgICAgICBjb3B5VG8gPSBcInNyY3NldFwiO1xuICAgICAgICAgIH0gZWxzZSBpZiAoL15cXHMqXFxTK1xcLihqcGd8anBlZ3xwbmd8d2VicClcXFMqXFxzKiQvLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvcHlUbyA9IFwic3JjXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb3B5VG8pIHtcbiAgICAgICAgICAgIC8vaWYgdGhpcyBpcyBhbiBpbWcgb3IgcGljdHVyZSwgc2V0IHRoZSBhdHRyaWJ1dGUgZGlyZWN0bHlcbiAgICAgICAgICAgIGlmIChlbGVtLnRhZ05hbWUgPT09IFwiSU1HXCIgfHwgZWxlbS50YWdOYW1lID09PSBcIlBJQ1RVUkVcIikge1xuICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShjb3B5VG8sIGF0dHIudmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgZWxlbS50YWdOYW1lID09PSBcIkZJR1VSRVwiICYmXG4gICAgICAgICAgICAgICF0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZWxlbSwgW1wiaW1nXCIsIFwicGljdHVyZVwiXSkubGVuZ3RoXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgLy9pZiB0aGUgaXRlbSBpcyBhIDxmaWd1cmU+IHRoYXQgZG9lcyBub3QgY29udGFpbiBhbiBpbWFnZSBvciBwaWN0dXJlLCBjcmVhdGUgb25lIGFuZCBwbGFjZSBpdCBpbnNpZGUgdGhlIGZpZ3VyZVxuICAgICAgICAgICAgICAvL3NlZSB0aGUgbnl0aW1lcy0zIHRlc3RjYXNlIGZvciBhbiBleGFtcGxlXG4gICAgICAgICAgICAgIHZhciBpbWcgPSB0aGlzLl9kb2MuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShjb3B5VG8sIGF0dHIudmFsdWUpO1xuICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBfZ2V0VGV4dERlbnNpdHkoZSwgdGFncykge1xuICAgIHZhciB0ZXh0TGVuZ3RoID0gdGhpcy5fZ2V0SW5uZXJUZXh0KGUsIHRydWUpLmxlbmd0aDtcbiAgICBpZiAodGV4dExlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBjaGlsZHJlbkxlbmd0aCA9IDA7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGUsIHRhZ3MpO1xuICAgIHRoaXMuX2ZvckVhY2hOb2RlKFxuICAgICAgY2hpbGRyZW4sXG4gICAgICBjaGlsZCA9PiAoY2hpbGRyZW5MZW5ndGggKz0gdGhpcy5fZ2V0SW5uZXJUZXh0KGNoaWxkLCB0cnVlKS5sZW5ndGgpXG4gICAgKTtcbiAgICByZXR1cm4gY2hpbGRyZW5MZW5ndGggLyB0ZXh0TGVuZ3RoO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhbiBhbiBlbGVtZW50IG9mIGFsbCB0YWdzIG9mIHR5cGUgXCJ0YWdcIiBpZiB0aGV5IGxvb2sgZmlzaHkuXG4gICAqIFwiRmlzaHlcIiBpcyBhbiBhbGdvcml0aG0gYmFzZWQgb24gY29udGVudCBsZW5ndGgsIGNsYXNzbmFtZXMsIGxpbmsgZGVuc2l0eSwgbnVtYmVyIG9mIGltYWdlcyAmIGVtYmVkcywgZXRjLlxuICAgKlxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICoqL1xuICBfY2xlYW5Db25kaXRpb25hbGx5KGUsIHRhZykge1xuICAgIGlmICghdGhpcy5fZmxhZ0lzQWN0aXZlKHRoaXMuRkxBR19DTEVBTl9DT05ESVRJT05BTExZKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEdhdGhlciBjb3VudHMgZm9yIG90aGVyIHR5cGljYWwgZWxlbWVudHMgZW1iZWRkZWQgd2l0aGluLlxuICAgIC8vIFRyYXZlcnNlIGJhY2t3YXJkcyBzbyB3ZSBjYW4gcmVtb3ZlIG5vZGVzIGF0IHRoZSBzYW1lIHRpbWVcbiAgICAvLyB3aXRob3V0IGVmZmVjdGluZyB0aGUgdHJhdmVyc2FsLlxuICAgIC8vXG4gICAgLy8gVE9ETzogQ29uc2lkZXIgdGFraW5nIGludG8gYWNjb3VudCBvcmlnaW5hbCBjb250ZW50U2NvcmUgaGVyZS5cbiAgICB0aGlzLl9yZW1vdmVOb2Rlcyh0aGlzLl9nZXRBbGxOb2Rlc1dpdGhUYWcoZSwgW3RhZ10pLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgdGhpcyBub2RlIElTIGRhdGEgdGFibGUsIGluIHdoaWNoIGNhc2UgZG9uJ3QgcmVtb3ZlIGl0LlxuICAgICAgdmFyIGlzRGF0YVRhYmxlID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuX3JlYWRhYmlsaXR5RGF0YVRhYmxlO1xuICAgICAgfTtcblxuICAgICAgdmFyIGlzTGlzdCA9IHRhZyA9PT0gXCJ1bFwiIHx8IHRhZyA9PT0gXCJvbFwiO1xuICAgICAgaWYgKCFpc0xpc3QpIHtcbiAgICAgICAgdmFyIGxpc3RMZW5ndGggPSAwO1xuICAgICAgICB2YXIgbGlzdE5vZGVzID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKG5vZGUsIFtcInVsXCIsIFwib2xcIl0pO1xuICAgICAgICB0aGlzLl9mb3JFYWNoTm9kZShcbiAgICAgICAgICBsaXN0Tm9kZXMsXG4gICAgICAgICAgbGlzdCA9PiAobGlzdExlbmd0aCArPSB0aGlzLl9nZXRJbm5lclRleHQobGlzdCkubGVuZ3RoKVxuICAgICAgICApO1xuICAgICAgICBpc0xpc3QgPSBsaXN0TGVuZ3RoIC8gdGhpcy5fZ2V0SW5uZXJUZXh0KG5vZGUpLmxlbmd0aCA+IDAuOTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRhZyA9PT0gXCJ0YWJsZVwiICYmIGlzRGF0YVRhYmxlKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gTmV4dCBjaGVjayBpZiB3ZSdyZSBpbnNpZGUgYSBkYXRhIHRhYmxlLCBpbiB3aGljaCBjYXNlIGRvbid0IHJlbW92ZSBpdCBhcyB3ZWxsLlxuICAgICAgaWYgKHRoaXMuX2hhc0FuY2VzdG9yVGFnKG5vZGUsIFwidGFibGVcIiwgLTEsIGlzRGF0YVRhYmxlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9oYXNBbmNlc3RvclRhZyhub2RlLCBcImNvZGVcIikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBrZWVwIGVsZW1lbnQgaWYgaXQgaGFzIGEgZGF0YSB0YWJsZXNcbiAgICAgIGlmIChcbiAgICAgICAgWy4uLm5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0YWJsZVwiKV0uc29tZShcbiAgICAgICAgICB0YmwgPT4gdGJsLl9yZWFkYWJpbGl0eURhdGFUYWJsZVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgd2VpZ2h0ID0gdGhpcy5fZ2V0Q2xhc3NXZWlnaHQobm9kZSk7XG5cbiAgICAgIHRoaXMubG9nKFwiQ2xlYW5pbmcgQ29uZGl0aW9uYWxseVwiLCBub2RlKTtcblxuICAgICAgdmFyIGNvbnRlbnRTY29yZSA9IDA7XG5cbiAgICAgIGlmICh3ZWlnaHQgKyBjb250ZW50U2NvcmUgPCAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fZ2V0Q2hhckNvdW50KG5vZGUsIFwiLFwiKSA8IDEwKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBub3QgdmVyeSBtYW55IGNvbW1hcywgYW5kIHRoZSBudW1iZXIgb2ZcbiAgICAgICAgLy8gbm9uLXBhcmFncmFwaCBlbGVtZW50cyBpcyBtb3JlIHRoYW4gcGFyYWdyYXBocyBvciBvdGhlclxuICAgICAgICAvLyBvbWlub3VzIHNpZ25zLCByZW1vdmUgdGhlIGVsZW1lbnQuXG4gICAgICAgIHZhciBwID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBcIikubGVuZ3RoO1xuICAgICAgICB2YXIgaW1nID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKS5sZW5ndGg7XG4gICAgICAgIHZhciBsaSA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKS5sZW5ndGggLSAxMDA7XG4gICAgICAgIHZhciBpbnB1dCA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKS5sZW5ndGg7XG4gICAgICAgIHZhciBoZWFkaW5nRGVuc2l0eSA9IHRoaXMuX2dldFRleHREZW5zaXR5KG5vZGUsIFtcbiAgICAgICAgICBcImgxXCIsXG4gICAgICAgICAgXCJoMlwiLFxuICAgICAgICAgIFwiaDNcIixcbiAgICAgICAgICBcImg0XCIsXG4gICAgICAgICAgXCJoNVwiLFxuICAgICAgICAgIFwiaDZcIixcbiAgICAgICAgXSk7XG5cbiAgICAgICAgdmFyIGVtYmVkQ291bnQgPSAwO1xuICAgICAgICB2YXIgZW1iZWRzID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKG5vZGUsIFtcbiAgICAgICAgICBcIm9iamVjdFwiLFxuICAgICAgICAgIFwiZW1iZWRcIixcbiAgICAgICAgICBcImlmcmFtZVwiLFxuICAgICAgICBdKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVtYmVkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIC8vIElmIHRoaXMgZW1iZWQgaGFzIGF0dHJpYnV0ZSB0aGF0IG1hdGNoZXMgdmlkZW8gcmVnZXgsIGRvbid0IGRlbGV0ZSBpdC5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGVtYmVkc1tpXS5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYWxsb3dlZFZpZGVvUmVnZXgudGVzdChlbWJlZHNbaV0uYXR0cmlidXRlc1tqXS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEZvciBlbWJlZCB3aXRoIDxvYmplY3Q+IHRhZywgY2hlY2sgaW5uZXIgSFRNTCBhcyB3ZWxsLlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGVtYmVkc1tpXS50YWdOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICB0aGlzLl9hbGxvd2VkVmlkZW9SZWdleC50ZXN0KGVtYmVkc1tpXS5pbm5lckhUTUwpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZW1iZWRDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlubmVyVGV4dCA9IHRoaXMuX2dldElubmVyVGV4dChub2RlKTtcblxuICAgICAgICAvLyB0b3NzIGFueSBub2RlIHdob3NlIGlubmVyIHRleHQgY29udGFpbnMgbm90aGluZyBidXQgc3VzcGljaW91cyB3b3Jkc1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5SRUdFWFBTLmFkV29yZHMudGVzdChpbm5lclRleHQpIHx8XG4gICAgICAgICAgdGhpcy5SRUdFWFBTLmxvYWRpbmdXb3Jkcy50ZXN0KGlubmVyVGV4dClcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29udGVudExlbmd0aCA9IGlubmVyVGV4dC5sZW5ndGg7XG4gICAgICAgIHZhciBsaW5rRGVuc2l0eSA9IHRoaXMuX2dldExpbmtEZW5zaXR5KG5vZGUpO1xuICAgICAgICB2YXIgdGV4dGlzaFRhZ3MgPSBbXCJTUEFOXCIsIFwiTElcIiwgXCJURFwiXS5jb25jYXQoXG4gICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLkRJVl9UT19QX0VMRU1TKVxuICAgICAgICApO1xuICAgICAgICB2YXIgdGV4dERlbnNpdHkgPSB0aGlzLl9nZXRUZXh0RGVuc2l0eShub2RlLCB0ZXh0aXNoVGFncyk7XG4gICAgICAgIHZhciBpc0ZpZ3VyZUNoaWxkID0gdGhpcy5faGFzQW5jZXN0b3JUYWcobm9kZSwgXCJmaWd1cmVcIik7XG5cbiAgICAgICAgLy8gYXBwbHkgc2hhZGluZXNzIGNoZWNrcywgdGhlbiBjaGVjayBmb3IgZXhjZXB0aW9uc1xuICAgICAgICBjb25zdCBzaG91bGRSZW1vdmVOb2RlID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVycnMgPSBbXTtcbiAgICAgICAgICBpZiAoIWlzRmlndXJlQ2hpbGQgJiYgaW1nID4gMSAmJiBwIC8gaW1nIDwgMC41KSB7XG4gICAgICAgICAgICBlcnJzLnB1c2goYEJhZCBwIHRvIGltZyByYXRpbyAoaW1nPSR7aW1nfSwgcD0ke3B9KWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWlzTGlzdCAmJiBsaSA+IHApIHtcbiAgICAgICAgICAgIGVycnMucHVzaChgVG9vIG1hbnkgbGkncyBvdXRzaWRlIG9mIGEgbGlzdC4gKGxpPSR7bGl9ID4gcD0ke3B9KWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaW5wdXQgPiBNYXRoLmZsb29yKHAgLyAzKSkge1xuICAgICAgICAgICAgZXJycy5wdXNoKGBUb28gbWFueSBpbnB1dHMgcGVyIHAuIChpbnB1dD0ke2lucHV0fSwgcD0ke3B9KWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhaXNMaXN0ICYmXG4gICAgICAgICAgICAhaXNGaWd1cmVDaGlsZCAmJlxuICAgICAgICAgICAgaGVhZGluZ0RlbnNpdHkgPCAwLjkgJiZcbiAgICAgICAgICAgIGNvbnRlbnRMZW5ndGggPCAyNSAmJlxuICAgICAgICAgICAgKGltZyA9PT0gMCB8fCBpbWcgPiAyKSAmJlxuICAgICAgICAgICAgbGlua0RlbnNpdHkgPiAwXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBlcnJzLnB1c2goXG4gICAgICAgICAgICAgIGBTdXNwaWNpb3VzbHkgc2hvcnQuIChoZWFkaW5nRGVuc2l0eT0ke2hlYWRpbmdEZW5zaXR5fSwgaW1nPSR7aW1nfSwgbGlua0RlbnNpdHk9JHtsaW5rRGVuc2l0eX0pYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWlzTGlzdCAmJlxuICAgICAgICAgICAgd2VpZ2h0IDwgMjUgJiZcbiAgICAgICAgICAgIGxpbmtEZW5zaXR5ID4gMC4yICsgdGhpcy5fbGlua0RlbnNpdHlNb2RpZmllclxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZXJycy5wdXNoKFxuICAgICAgICAgICAgICBgTG93IHdlaWdodCBhbmQgYSBsaXR0bGUgbGlua3kuIChsaW5rRGVuc2l0eT0ke2xpbmtEZW5zaXR5fSlgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAod2VpZ2h0ID49IDI1ICYmIGxpbmtEZW5zaXR5ID4gMC41ICsgdGhpcy5fbGlua0RlbnNpdHlNb2RpZmllcikge1xuICAgICAgICAgICAgZXJycy5wdXNoKFxuICAgICAgICAgICAgICBgSGlnaCB3ZWlnaHQgYW5kIG1vc3RseSBsaW5rcy4gKGxpbmtEZW5zaXR5PSR7bGlua0RlbnNpdHl9KWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoZW1iZWRDb3VudCA9PT0gMSAmJiBjb250ZW50TGVuZ3RoIDwgNzUpIHx8IGVtYmVkQ291bnQgPiAxKSB7XG4gICAgICAgICAgICBlcnJzLnB1c2goXG4gICAgICAgICAgICAgIGBTdXNwaWNpb3VzIGVtYmVkLiAoZW1iZWRDb3VudD0ke2VtYmVkQ291bnR9LCBjb250ZW50TGVuZ3RoPSR7Y29udGVudExlbmd0aH0pYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGltZyA9PT0gMCAmJiB0ZXh0RGVuc2l0eSA9PT0gMCkge1xuICAgICAgICAgICAgZXJycy5wdXNoKFxuICAgICAgICAgICAgICBgTm8gdXNlZnVsIGNvbnRlbnQuIChpbWc9JHtpbWd9LCB0ZXh0RGVuc2l0eT0ke3RleHREZW5zaXR5fSlgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlcnJzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5sb2coXCJDaGVja3MgZmFpbGVkXCIsIGVycnMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBoYXZlVG9SZW1vdmUgPSBzaG91bGRSZW1vdmVOb2RlKCk7XG5cbiAgICAgICAgLy8gQWxsb3cgc2ltcGxlIGxpc3RzIG9mIGltYWdlcyB0byByZW1haW4gaW4gcGFnZXNcbiAgICAgICAgaWYgKGlzTGlzdCAmJiBoYXZlVG9SZW1vdmUpIHtcbiAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IG5vZGUuY2hpbGRyZW5beF07XG4gICAgICAgICAgICAvLyBEb24ndCBmaWx0ZXIgaW4gbGlzdHMgd2l0aCBsaSdzIHRoYXQgY29udGFpbiBtb3JlIHRoYW4gb25lIGNoaWxkXG4gICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICByZXR1cm4gaGF2ZVRvUmVtb3ZlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgbGlfY291bnQgPSBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIikubGVuZ3RoO1xuICAgICAgICAgIC8vIE9ubHkgYWxsb3cgdGhlIGxpc3QgdG8gcmVtYWluIGlmIGV2ZXJ5IGxpIGNvbnRhaW5zIGFuIGltYWdlXG4gICAgICAgICAgaWYgKGltZyA9PSBsaV9jb3VudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGF2ZVRvUmVtb3ZlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhbiBvdXQgZWxlbWVudHMgdGhhdCBtYXRjaCB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnRcbiAgICogQHBhcmFtIEZ1bmN0aW9uIGRldGVybWluZXMgd2hldGhlciBhIG5vZGUgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICogQHJldHVybiB2b2lkXG4gICAqKi9cbiAgX2NsZWFuTWF0Y2hlZE5vZGVzKGUsIGZpbHRlcikge1xuICAgIHZhciBlbmRPZlNlYXJjaE1hcmtlck5vZGUgPSB0aGlzLl9nZXROZXh0Tm9kZShlLCB0cnVlKTtcbiAgICB2YXIgbmV4dCA9IHRoaXMuX2dldE5leHROb2RlKGUpO1xuICAgIHdoaWxlIChuZXh0ICYmIG5leHQgIT0gZW5kT2ZTZWFyY2hNYXJrZXJOb2RlKSB7XG4gICAgICBpZiAoZmlsdGVyLmNhbGwodGhpcywgbmV4dCwgbmV4dC5jbGFzc05hbWUgKyBcIiBcIiArIG5leHQuaWQpKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLl9yZW1vdmVBbmRHZXROZXh0KG5leHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuX2dldE5leHROb2RlKG5leHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2xlYW4gb3V0IHNwdXJpb3VzIGhlYWRlcnMgZnJvbSBhbiBFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gRWxlbWVudFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICoqL1xuICBfY2xlYW5IZWFkZXJzKGUpIHtcbiAgICBsZXQgaGVhZGluZ05vZGVzID0gdGhpcy5fZ2V0QWxsTm9kZXNXaXRoVGFnKGUsIFtcImgxXCIsIFwiaDJcIl0pO1xuICAgIHRoaXMuX3JlbW92ZU5vZGVzKGhlYWRpbmdOb2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGxldCBzaG91bGRSZW1vdmUgPSB0aGlzLl9nZXRDbGFzc1dlaWdodChub2RlKSA8IDA7XG4gICAgICBpZiAoc2hvdWxkUmVtb3ZlKSB7XG4gICAgICAgIHRoaXMubG9nKFwiUmVtb3ZpbmcgaGVhZGVyIHdpdGggbG93IGNsYXNzIHdlaWdodDpcIiwgbm9kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2hvdWxkUmVtb3ZlO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIG5vZGUgaXMgYW4gSDEgb3IgSDIgZWxlbWVudCB3aG9zZSBjb250ZW50IGlzIG1vc3RseVxuICAgKiB0aGUgc2FtZSBhcyB0aGUgYXJ0aWNsZSB0aXRsZS5cbiAgICpcbiAgICogQHBhcmFtIEVsZW1lbnQgIHRoZSBub2RlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJuIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoaXMgaXMgYSB0aXRsZS1saWtlIGhlYWRlci5cbiAgICovXG4gIF9oZWFkZXJEdXBsaWNhdGVzVGl0bGUobm9kZSkge1xuICAgIGlmIChub2RlLnRhZ05hbWUgIT0gXCJIMVwiICYmIG5vZGUudGFnTmFtZSAhPSBcIkgyXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGhlYWRpbmcgPSB0aGlzLl9nZXRJbm5lclRleHQobm9kZSwgZmFsc2UpO1xuICAgIHRoaXMubG9nKFwiRXZhbHVhdGluZyBzaW1pbGFyaXR5IG9mIGhlYWRlcjpcIiwgaGVhZGluZywgdGhpcy5fYXJ0aWNsZVRpdGxlKTtcbiAgICByZXR1cm4gdGhpcy5fdGV4dFNpbWlsYXJpdHkodGhpcy5fYXJ0aWNsZVRpdGxlLCBoZWFkaW5nKSA+IDAuNzU7XG4gIH0sXG5cbiAgX2ZsYWdJc0FjdGl2ZShmbGFnKSB7XG4gICAgcmV0dXJuICh0aGlzLl9mbGFncyAmIGZsYWcpID4gMDtcbiAgfSxcblxuICBfcmVtb3ZlRmxhZyhmbGFnKSB7XG4gICAgdGhpcy5fZmxhZ3MgPSB0aGlzLl9mbGFncyAmIH5mbGFnO1xuICB9LFxuXG4gIF9pc1Byb2JhYmx5VmlzaWJsZShub2RlKSB7XG4gICAgLy8gSGF2ZSB0byBudWxsLWNoZWNrIG5vZGUuc3R5bGUgYW5kIG5vZGUuY2xhc3NOYW1lLmluY2x1ZGVzIHRvIGRlYWwgd2l0aCBTVkcgYW5kIE1hdGhNTCBub2Rlcy5cbiAgICByZXR1cm4gKFxuICAgICAgKCFub2RlLnN0eWxlIHx8IG5vZGUuc3R5bGUuZGlzcGxheSAhPSBcIm5vbmVcIikgJiZcbiAgICAgICghbm9kZS5zdHlsZSB8fCBub2RlLnN0eWxlLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIikgJiZcbiAgICAgICFub2RlLmhhc0F0dHJpYnV0ZShcImhpZGRlblwiKSAmJlxuICAgICAgLy9jaGVjayBmb3IgXCJmYWxsYmFjay1pbWFnZVwiIHNvIHRoYXQgd2lraW1lZGlhIG1hdGggaW1hZ2VzIGFyZSBkaXNwbGF5ZWRcbiAgICAgICghbm9kZS5oYXNBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSB8fFxuICAgICAgICBub2RlLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpICE9IFwidHJ1ZVwiIHx8XG4gICAgICAgIChub2RlLmNsYXNzTmFtZSAmJlxuICAgICAgICAgIG5vZGUuY2xhc3NOYW1lLmluY2x1ZGVzICYmXG4gICAgICAgICAgbm9kZS5jbGFzc05hbWUuaW5jbHVkZXMoXCJmYWxsYmFjay1pbWFnZVwiKSkpXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogUnVucyByZWFkYWJpbGl0eS5cbiAgICpcbiAgICogV29ya2Zsb3c6XG4gICAqICAxLiBQcmVwIHRoZSBkb2N1bWVudCBieSByZW1vdmluZyBzY3JpcHQgdGFncywgY3NzLCBldGMuXG4gICAqICAyLiBCdWlsZCByZWFkYWJpbGl0eSdzIERPTSB0cmVlLlxuICAgKiAgMy4gR3JhYiB0aGUgYXJ0aWNsZSBjb250ZW50IGZyb20gdGhlIGN1cnJlbnQgZG9tIHRyZWUuXG4gICAqICA0LiBSZXBsYWNlIHRoZSBjdXJyZW50IERPTSB0cmVlIHdpdGggdGhlIG5ldyBvbmUuXG4gICAqICA1LiBSZWFkIHBlYWNlZnVsbHkuXG4gICAqXG4gICAqIEByZXR1cm4gdm9pZFxuICAgKiovXG4gIHBhcnNlKCkge1xuICAgIC8vIEF2b2lkIHBhcnNpbmcgdG9vIGxhcmdlIGRvY3VtZW50cywgYXMgcGVyIGNvbmZpZ3VyYXRpb24gb3B0aW9uXG4gICAgaWYgKHRoaXMuX21heEVsZW1zVG9QYXJzZSA+IDApIHtcbiAgICAgIHZhciBudW1UYWdzID0gdGhpcy5fZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKS5sZW5ndGg7XG4gICAgICBpZiAobnVtVGFncyA+IHRoaXMuX21heEVsZW1zVG9QYXJzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJBYm9ydGluZyBwYXJzaW5nIGRvY3VtZW50OyBcIiArIG51bVRhZ3MgKyBcIiBlbGVtZW50cyBmb3VuZFwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVW53cmFwIGltYWdlIGZyb20gbm9zY3JpcHRcbiAgICB0aGlzLl91bndyYXBOb3NjcmlwdEltYWdlcyh0aGlzLl9kb2MpO1xuXG4gICAgLy8gRXh0cmFjdCBKU09OLUxEIG1ldGFkYXRhIGJlZm9yZSByZW1vdmluZyBzY3JpcHRzXG4gICAgdmFyIGpzb25MZCA9IHRoaXMuX2Rpc2FibGVKU09OTEQgPyB7fSA6IHRoaXMuX2dldEpTT05MRCh0aGlzLl9kb2MpO1xuXG4gICAgLy8gUmVtb3ZlIHNjcmlwdCB0YWdzIGZyb20gdGhlIGRvY3VtZW50LlxuICAgIHRoaXMuX3JlbW92ZVNjcmlwdHModGhpcy5fZG9jKTtcblxuICAgIHRoaXMuX3ByZXBEb2N1bWVudCgpO1xuXG4gICAgdmFyIG1ldGFkYXRhID0gdGhpcy5fZ2V0QXJ0aWNsZU1ldGFkYXRhKGpzb25MZCk7XG4gICAgdGhpcy5fbWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICB0aGlzLl9hcnRpY2xlVGl0bGUgPSBtZXRhZGF0YS50aXRsZTtcblxuICAgIHZhciBhcnRpY2xlQ29udGVudCA9IHRoaXMuX2dyYWJBcnRpY2xlKCk7XG4gICAgaWYgKCFhcnRpY2xlQ29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5sb2coXCJHcmFiYmVkOiBcIiArIGFydGljbGVDb250ZW50LmlubmVySFRNTCk7XG5cbiAgICB0aGlzLl9wb3N0UHJvY2Vzc0NvbnRlbnQoYXJ0aWNsZUNvbnRlbnQpO1xuXG4gICAgLy8gSWYgd2UgaGF2ZW4ndCBmb3VuZCBhbiBleGNlcnB0IGluIHRoZSBhcnRpY2xlJ3MgbWV0YWRhdGEsIHVzZSB0aGUgYXJ0aWNsZSdzXG4gICAgLy8gZmlyc3QgcGFyYWdyYXBoIGFzIHRoZSBleGNlcnB0LiBUaGlzIGlzIHVzZWQgZm9yIGRpc3BsYXlpbmcgYSBwcmV2aWV3IG9mXG4gICAgLy8gdGhlIGFydGljbGUncyBjb250ZW50LlxuICAgIGlmICghbWV0YWRhdGEuZXhjZXJwdCkge1xuICAgICAgdmFyIHBhcmFncmFwaHMgPSBhcnRpY2xlQ29udGVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBcIik7XG4gICAgICBpZiAocGFyYWdyYXBocy5sZW5ndGgpIHtcbiAgICAgICAgbWV0YWRhdGEuZXhjZXJwdCA9IHBhcmFncmFwaHNbMF0udGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0ZXh0Q29udGVudCA9IGFydGljbGVDb250ZW50LnRleHRDb250ZW50O1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogdGhpcy5fYXJ0aWNsZVRpdGxlLFxuICAgICAgYnlsaW5lOiBtZXRhZGF0YS5ieWxpbmUgfHwgdGhpcy5fYXJ0aWNsZUJ5bGluZSxcbiAgICAgIGRpcjogdGhpcy5fYXJ0aWNsZURpcixcbiAgICAgIGxhbmc6IHRoaXMuX2FydGljbGVMYW5nLFxuICAgICAgY29udGVudDogdGhpcy5fc2VyaWFsaXplcihhcnRpY2xlQ29udGVudCksXG4gICAgICB0ZXh0Q29udGVudCxcbiAgICAgIGxlbmd0aDogdGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgZXhjZXJwdDogbWV0YWRhdGEuZXhjZXJwdCxcbiAgICAgIHNpdGVOYW1lOiBtZXRhZGF0YS5zaXRlTmFtZSB8fCB0aGlzLl9hcnRpY2xlU2l0ZU5hbWUsXG4gICAgICBwdWJsaXNoZWRUaW1lOiBtZXRhZGF0YS5wdWJsaXNoZWRUaW1lLFxuICAgIH07XG4gIH0sXG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIikge1xuICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVkZWNsYXJlICovXG4gIC8qIGdsb2JhbCBtb2R1bGUgKi9cbiAgbW9kdWxlLmV4cG9ydHMgPSBSZWFkYWJpbGl0eTtcbn1cbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgQXJjOTAgSW5jXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qXG4gKiBUaGlzIGNvZGUgaXMgaGVhdmlseSBiYXNlZCBvbiBBcmM5MCdzIHJlYWRhYmlsaXR5LmpzICgxLjcuMSkgc2NyaXB0XG4gKiBhdmFpbGFibGUgYXQ6IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9hcmM5MGxhYnMtcmVhZGFiaWxpdHlcbiAqL1xuXG52YXIgUkVHRVhQUyA9IHtcbiAgLy8gTk9URTogVGhlc2UgdHdvIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYXJlIGR1cGxpY2F0ZWQgaW5cbiAgLy8gUmVhZGFiaWxpdHkuanMuIFBsZWFzZSBrZWVwIGJvdGggY29waWVzIGluIHN5bmMuXG4gIHVubGlrZWx5Q2FuZGlkYXRlczpcbiAgICAvLWFkLXxhaTJodG1sfGJhbm5lcnxicmVhZGNydW1ic3xjb21ieHxjb21tZW50fGNvbW11bml0eXxjb3Zlci13cmFwfGRpc3F1c3xleHRyYXxmb290ZXJ8Z2RwcnxoZWFkZXJ8bGVnZW5kc3xtZW51fHJlbGF0ZWR8cmVtYXJrfHJlcGxpZXN8cnNzfHNob3V0Ym94fHNpZGViYXJ8c2t5c2NyYXBlcnxzb2NpYWx8c3BvbnNvcnxzdXBwbGVtZW50YWx8YWQtYnJlYWt8YWdlZ2F0ZXxwYWdpbmF0aW9ufHBhZ2VyfHBvcHVwfHlvbS1yZW1vdGUvaSxcbiAgb2tNYXliZUl0c0FDYW5kaWRhdGU6IC9hbmR8YXJ0aWNsZXxib2R5fGNvbHVtbnxjb250ZW50fG1haW58c2hhZG93L2ksXG59O1xuXG5mdW5jdGlvbiBpc05vZGVWaXNpYmxlKG5vZGUpIHtcbiAgLy8gSGF2ZSB0byBudWxsLWNoZWNrIG5vZGUuc3R5bGUgYW5kIG5vZGUuY2xhc3NOYW1lLmluY2x1ZGVzIHRvIGRlYWwgd2l0aCBTVkcgYW5kIE1hdGhNTCBub2Rlcy5cbiAgcmV0dXJuIChcbiAgICAoIW5vZGUuc3R5bGUgfHwgbm9kZS5zdHlsZS5kaXNwbGF5ICE9IFwibm9uZVwiKSAmJlxuICAgICFub2RlLmhhc0F0dHJpYnV0ZShcImhpZGRlblwiKSAmJlxuICAgIC8vY2hlY2sgZm9yIFwiZmFsbGJhY2staW1hZ2VcIiBzbyB0aGF0IHdpa2ltZWRpYSBtYXRoIGltYWdlcyBhcmUgZGlzcGxheWVkXG4gICAgKCFub2RlLmhhc0F0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpIHx8XG4gICAgICBub2RlLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpICE9IFwidHJ1ZVwiIHx8XG4gICAgICAobm9kZS5jbGFzc05hbWUgJiZcbiAgICAgICAgbm9kZS5jbGFzc05hbWUuaW5jbHVkZXMgJiZcbiAgICAgICAgbm9kZS5jbGFzc05hbWUuaW5jbHVkZXMoXCJmYWxsYmFjay1pbWFnZVwiKSkpXG4gICk7XG59XG5cbi8qKlxuICogRGVjaWRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgZG9jdW1lbnQgaXMgcmVhZGVyLWFibGUgd2l0aG91dCBwYXJzaW5nIHRoZSB3aG9sZSB0aGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1pbkNvbnRlbnRMZW5ndGg9MTQwXSBUaGUgbWluaW11bSBub2RlIGNvbnRlbnQgbGVuZ3RoIHVzZWQgdG8gZGVjaWRlIGlmIHRoZSBkb2N1bWVudCBpcyByZWFkZXJhYmxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1pblNjb3JlPTIwXSBUaGUgbWludW11bSBjdW11bGF0ZWQgJ3Njb3JlJyB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZG9jdW1lbnQgaXMgcmVhZGVyYWJsZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnZpc2liaWxpdHlDaGVja2VyPWlzTm9kZVZpc2libGVdIFRoZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiBhIG5vZGUgaXMgdmlzaWJsZS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHdlIHN1c3BlY3QgUmVhZGFiaWxpdHkucGFyc2UoKSB3aWxsIHN1Y2VlZWQgYXQgcmV0dXJuaW5nIGFuIGFydGljbGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpc1Byb2JhYmx5UmVhZGVyYWJsZShkb2MsIG9wdGlvbnMgPSB7fSkge1xuICAvLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSByZWFzb25zICdvcHRpb25zJyBjYW4gZWl0aGVyIGJlIGEgY29uZmlndXJhdGlvbiBvYmplY3Qgb3IgdGhlIGZ1bmN0aW9uIHVzZWRcbiAgLy8gdG8gZGV0ZXJtaW5lIGlmIGEgbm9kZSBpcyB2aXNpYmxlLlxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgb3B0aW9ucyA9IHsgdmlzaWJpbGl0eUNoZWNrZXI6IG9wdGlvbnMgfTtcbiAgfVxuXG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBtaW5TY29yZTogMjAsXG4gICAgbWluQ29udGVudExlbmd0aDogMTQwLFxuICAgIHZpc2liaWxpdHlDaGVja2VyOiBpc05vZGVWaXNpYmxlLFxuICB9O1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgdmFyIG5vZGVzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJwLCBwcmUsIGFydGljbGVcIik7XG5cbiAgLy8gR2V0IDxkaXY+IG5vZGVzIHdoaWNoIGhhdmUgPGJyPiBub2RlKHMpIGFuZCBhcHBlbmQgdGhlbSBpbnRvIHRoZSBgbm9kZXNgIHZhcmlhYmxlLlxuICAvLyBTb21lIGFydGljbGVzJyBET00gc3RydWN0dXJlcyBtaWdodCBsb29rIGxpa2VcbiAgLy8gPGRpdj5cbiAgLy8gICBTZW50ZW5jZXM8YnI+XG4gIC8vICAgPGJyPlxuICAvLyAgIFNlbnRlbmNlczxicj5cbiAgLy8gPC9kaXY+XG4gIHZhciBick5vZGVzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXYgPiBiclwiKTtcbiAgaWYgKGJyTm9kZXMubGVuZ3RoKSB7XG4gICAgdmFyIHNldCA9IG5ldyBTZXQobm9kZXMpO1xuICAgIFtdLmZvckVhY2guY2FsbChick5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgc2V0LmFkZChub2RlLnBhcmVudE5vZGUpO1xuICAgIH0pO1xuICAgIG5vZGVzID0gQXJyYXkuZnJvbShzZXQpO1xuICB9XG5cbiAgdmFyIHNjb3JlID0gMDtcbiAgLy8gVGhpcyBpcyBhIGxpdHRsZSBjaGVla3ksIHdlIHVzZSB0aGUgYWNjdW11bGF0b3IgJ3Njb3JlJyB0byBkZWNpZGUgd2hhdCB0byByZXR1cm4gZnJvbVxuICAvLyB0aGlzIGNhbGxiYWNrOlxuICByZXR1cm4gW10uc29tZS5jYWxsKG5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmICghb3B0aW9ucy52aXNpYmlsaXR5Q2hlY2tlcihub2RlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBtYXRjaFN0cmluZyA9IG5vZGUuY2xhc3NOYW1lICsgXCIgXCIgKyBub2RlLmlkO1xuICAgIGlmIChcbiAgICAgIFJFR0VYUFMudW5saWtlbHlDYW5kaWRhdGVzLnRlc3QobWF0Y2hTdHJpbmcpICYmXG4gICAgICAhUkVHRVhQUy5va01heWJlSXRzQUNhbmRpZGF0ZS50ZXN0KG1hdGNoU3RyaW5nKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChub2RlLm1hdGNoZXMoXCJsaSBwXCIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHRleHRDb250ZW50TGVuZ3RoID0gbm9kZS50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoO1xuICAgIGlmICh0ZXh0Q29udGVudExlbmd0aCA8IG9wdGlvbnMubWluQ29udGVudExlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNjb3JlICs9IE1hdGguc3FydCh0ZXh0Q29udGVudExlbmd0aCAtIG9wdGlvbnMubWluQ29udGVudExlbmd0aCk7XG5cbiAgICBpZiAoc2NvcmUgPiBvcHRpb25zLm1pblNjb3JlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIpIHtcbiAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlZGVjbGFyZSAqL1xuICAvKiBnbG9iYWwgbW9kdWxlICovXG4gIG1vZHVsZS5leHBvcnRzID0gaXNQcm9iYWJseVJlYWRlcmFibGU7XG59XG4iLCIvKiBlc2xpbnQtZW52IG5vZGUgKi9cbnZhciBSZWFkYWJpbGl0eSA9IHJlcXVpcmUoXCIuL1JlYWRhYmlsaXR5XCIpO1xudmFyIGlzUHJvYmFibHlSZWFkZXJhYmxlID0gcmVxdWlyZShcIi4vUmVhZGFiaWxpdHktcmVhZGVyYWJsZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFJlYWRhYmlsaXR5LFxuICBpc1Byb2JhYmx5UmVhZGVyYWJsZSxcbn07XG4iLCIvKipcbiAqIFRleHRSYW5rIEFsZ29yaXRtYXPEsSBpbGUgVMO8cmvDp2UgTWV0aW4gw5Z6ZXRsZW1lIE1vZMO8bMO8XG4gKlxuICogTWloYWxjZWEgJiBUYXJhdSAoMjAwNCkgdGFyYWbEsW5kYW4gw7ZuZXJpbGVuIFRleHRSYW5rIGFsZ29yaXRtYXPEsW7EsSBrdWxsYW5hcmFrXG4gKiBtZXRpbiBpw6dlcmlzaW5kZW4gZW4gw7ZuZW1saSBjw7xtbGVsZXJpIMOnxLFrYXLEsXIgKGV4dHJhY3RpdmUgc3VtbWFyaXphdGlvbikuXG4gKi9cblxuLyoqXG4gKiBUw7xya8OnZSBldGtpc2l6IGtlbGltZWxlciAoc3RvcCB3b3JkcykgbGlzdGVzaVxuICovXG5jb25zdCBUVVJLSVNIX1NUT1BfV09SRFMgPSBuZXcgU2V0PHN0cmluZz4oW1xuICAnYmlyJywgJ2J1JywgJ8WfdScsICdvJywgJ3ZlJywgJ2lsZScsICdkZScsICdkYScsICdpw6dpbicsICdnaWJpJywgJ2RhaGEnLCAnw6dvaycsXG4gICdoZXInLCAnbmUnLCAnYW1hJywgJ2FuY2FrJywgJ2tpJywgJ3lhJywgJ2hlbScsICd2ZXlhJywgJ2lzZScsICdiZW4nLCAnc2VuJyxcbiAgJ2JpeicsICdzaXonLCAndmFyJywgJ3lvaycsICdvbGFuJywgJ29sYXJhaycsICdkZW4nLCAnZGFuJywgJ2TEsXInLCAnZGlyJyxcbiAgJ23EsScsICdtaScsICdtdScsICdtw7wnLCAna2FkYXInLCAnc29ucmEnLCAnw7ZuY2UnLCAnYXJhc8SxbmRhJywgJ8O8emVyaW5kZScsXG4gICdhbHTEsW5kYScsICdiZXJpJywgJ2LDtnlsZScsICfFn8O2eWxlJywgJ2hhbmdpJywgJ2tlbmRpJywgJ2F5bsSxJywgJ2RpxJ9lcicsXG4gICdiYXrEsScsICd0w7xtJywgJ2VuJywgJ2hpw6cnXG5dKTtcblxuLyoqXG4gKiBNZXRuaSBjw7xtbGVsZXJlIGF5xLFyxLFyLlxuICogVMO8cmvDp2Ugbm9rdGFsYW1hIGnFn2FyZXRsZXJpbmkgKC4gISA/IOKApikgZGlra2F0ZSBhbMSxci5cbiAqXG4gKiBAcGFyYW0gdGV4dCBBeXLEscWfdMSxcsSxbGFjYWsgbWV0aW5cbiAqIEByZXR1cm5zIEPDvG1sZSBkaXppc2lcbiAqL1xuZnVuY3Rpb24gc3BsaXRJbnRvU2VudGVuY2VzKHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgaWYgKCF0ZXh0IHx8ICF0ZXh0LnRyaW0oKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8vIE5va3RhbGFtYSBpxZ9hcmV0bGVyaW5kZW4gc29ucmEgZ2VsZW4gYm/Fn2x1ayB2ZXlhIHNhdMSxciBzb25sYXLEsW5hIGfDtnJlIGLDtmxcbiAgLy8gLiAhID8g4oCmIGthcmFrdGVybGVyaW5pIGRlc3Rla2xlclxuICBjb25zdCByYXdTZW50ZW5jZXMgPSB0ZXh0XG4gICAgLnNwbGl0KC8oPzw9Wy4hP+KApl0rKVxccysvKVxuICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgIC5maWx0ZXIoKHMpID0+IHMubGVuZ3RoID4gMCk7XG5cbiAgcmV0dXJuIHJhd1NlbnRlbmNlcztcbn1cblxuLyoqXG4gKiBDw7xtbGV5aSBrZWxpbWVsZXJlICh0b2tlbikgYXnEsXLEsXIuXG4gKiBLw7zDp8O8ayBoYXJmZSBkw7Zuw7zFn3TDvHLDvHIgKFTDvHJrw6dlIGthcmFrdGVyIHV5dW1sdSksIG5va3RhbGFtYSBpxZ9hcmV0bGVyaW5pIHRlbWl6bGVyXG4gKiB2ZSBldGtpc2l6IGtlbGltZWxlcmkgKHN0b3Agd29yZHMpIGZpbHRyZWxlci5cbiAqXG4gKiBAcGFyYW0gc2VudGVuY2UgQ8O8bWxlIG1ldG5pXG4gKiBAcmV0dXJucyBGaWx0cmVsZW5tacWfIGtlbGltZSBkaXppc2lcbiAqL1xuZnVuY3Rpb24gdG9rZW5pemUoc2VudGVuY2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIHNlbnRlbmNlXG4gICAgLnRvTG9jYWxlTG93ZXJDYXNlKCd0ci1UUicpXG4gICAgLnJlcGxhY2UoL1teYS16w6fEn8Sxw7bFn8O8MC05XFxzXS9naSwgJyAnKVxuICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgLmZpbHRlcigod29yZCkgPT4gd29yZC5sZW5ndGggPiAwICYmICFUVVJLSVNIX1NUT1BfV09SRFMuaGFzKHdvcmQpKTtcbn1cblxuLyoqXG4gKiDEsGtpIGPDvG1sZSBhcmFzxLFuZGFraSBiZW56ZXJsaWsgc2tvcnVudSBoZXNhcGxhci5cbiAqIEZvcm3DvGw6IE9ydGFrIGV0a2lzaXogb2xtYXlhbiBrZWxpbWUgc2F5xLFzxLEgLyAobG9nKGxlbjEpICsgbG9nKGxlbjIpKVxuICpcbiAqIEBwYXJhbSB3b3JkczEgMS4gY8O8bWxlbmluIGZpbHRyZWxlbm1pxZ8ga2VsaW1lbGVyaVxuICogQHBhcmFtIHdvcmRzMiAyLiBjw7xtbGVuaW4gZmlsdHJlbGVubWnFnyBrZWxpbWVsZXJpXG4gKiBAcmV0dXJucyBCZW56ZXJsaWsgc2tvcnVcbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlU2ltaWxhcml0eSh3b3JkczE6IHN0cmluZ1tdLCB3b3JkczI6IHN0cmluZ1tdKTogbnVtYmVyIHtcbiAgaWYgKHdvcmRzMS5sZW5ndGggPT09IDAgfHwgd29yZHMyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3Qgc2V0MSA9IG5ldyBTZXQod29yZHMxKTtcbiAgY29uc3Qgc2V0MiA9IG5ldyBTZXQod29yZHMyKTtcblxuICAvLyBPcnRhayBrZWxpbWVsZXJpIHNheVxuICBsZXQgc2hhcmVkV29yZHNDb3VudCA9IDA7XG4gIGZvciAoY29uc3Qgd29yZCBvZiBzZXQxKSB7XG4gICAgaWYgKHNldDIuaGFzKHdvcmQpKSB7XG4gICAgICBzaGFyZWRXb3Jkc0NvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNoYXJlZFdvcmRzQ291bnQgPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFBheWRhOiBsb2cobGVuMSkgKyBsb2cobGVuMilcbiAgY29uc3QgZGVub20gPSBNYXRoLmxvZyh3b3JkczEubGVuZ3RoKSArIE1hdGgubG9nKHdvcmRzMi5sZW5ndGgpO1xuXG4gIC8vIFPEsWbEsXJhIHZleWEgbmVnYXRpZiBkZcSfZXJlIGLDtmxtZXlpIGVuZ2VsbGUgKMO2ci4gaGVyIGlraSBjw7xtbGUgZGUgMSBrZWxpbWVsaWtzZSBsb2coMSkrbG9nKDEpPTApXG4gIGlmIChkZW5vbSA8PSAwKSB7XG4gICAgcmV0dXJuIHNoYXJlZFdvcmRzQ291bnQ7XG4gIH1cblxuICByZXR1cm4gc2hhcmVkV29yZHNDb3VudCAvIGRlbm9tO1xufVxuXG4vKipcbiAqIEPDvG1sZWxlciDDvHplcmluZGUgUGFnZVJhbmsgYWxnb3JpdG1hc8SxbsSxIMOnYWzEscWfdMSxcmFyYWsgw7ZuZW0gc2tvcmxhcsSxbsSxIGhlc2FwbGFyLlxuICpcbiAqIEBwYXJhbSBzaW1pbGFyaXR5TWF0cml4IEPDvG1sZWxlciBhcmFzxLEgYmVuemVybGlrIG1hdHJpc2lcbiAqIEBwYXJhbSBkYW1waW5nRmFjdG9yIFPDtm7DvG1sZW1lIGthdHNhecSxc8SxICh2YXJzYXnEsWxhbjogMC44NSlcbiAqIEBwYXJhbSBpdGVyYXRpb25zIMSwdGVyYXN5b24gc2F5xLFzxLEgKHZhcnNhecSxbGFuOiAzMClcbiAqIEByZXR1cm5zIEhlciBjw7xtbGVuaW4gUGFnZVJhbmsgc2tvcnUgZGl6aXNpXG4gKi9cbmZ1bmN0aW9uIHJ1blBhZ2VSYW5rKFxuICBzaW1pbGFyaXR5TWF0cml4OiBudW1iZXJbXVtdLFxuICBkYW1waW5nRmFjdG9yID0gMC44NSxcbiAgaXRlcmF0aW9ucyA9IDMwXG4pOiBudW1iZXJbXSB7XG4gIGNvbnN0IG4gPSBzaW1pbGFyaXR5TWF0cml4Lmxlbmd0aDtcbiAgaWYgKG4gPT09IDApIHJldHVybiBbXTtcblxuICAvLyBCYcWfbGFuZ8Sxw6cgc2tvcmxhcsSxIChoZXIgZMO8xJ/DvG0gacOnaW4gMS4wKVxuICBsZXQgc2NvcmVzID0gbmV3IEFycmF5KG4pLmZpbGwoMS4wKTtcblxuICAvLyBIZXIgY8O8bWxlbmluIHRvcGxhbSBrZW5hciBhxJ/EsXJsxLHEn8SxICjDp8Sxa8SxxZ8gZGVyZWNlc2kpXG4gIGNvbnN0IHdlaWdodFN1bXMgPSBzaW1pbGFyaXR5TWF0cml4Lm1hcCgocm93KSA9PlxuICAgIHJvdy5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwsIDApXG4gICk7XG5cbiAgLy8gUGFnZVJhbmsgaXRlcmFzeW9ubGFyxLFcbiAgZm9yIChsZXQgaXRlciA9IDA7IGl0ZXIgPCBpdGVyYXRpb25zOyBpdGVyKyspIHtcbiAgICBjb25zdCBuZXh0U2NvcmVzID0gbmV3IEFycmF5KG4pLmZpbGwoMSAtIGRhbXBpbmdGYWN0b3IpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuOyBqKyspIHtcbiAgICAgICAgaWYgKGkgIT09IGogJiYgd2VpZ2h0U3Vtc1tqXSA+IDApIHtcbiAgICAgICAgICBzdW0gKz0gKHNpbWlsYXJpdHlNYXRyaXhbal1baV0gLyB3ZWlnaHRTdW1zW2pdKSAqIHNjb3Jlc1tqXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbmV4dFNjb3Jlc1tpXSArPSBkYW1waW5nRmFjdG9yICogc3VtO1xuICAgIH1cblxuICAgIHNjb3JlcyA9IG5leHRTY29yZXM7XG4gIH1cblxuICByZXR1cm4gc2NvcmVzO1xufVxuXG4vKipcbiAqIFZlcmlsZW4gbWV0bmkgVGV4dFJhbmsgYWxnb3JpdG1hc8SxIGt1bGxhbmFyYWsgw7Z6ZXRsZXIuXG4gKlxuICogQHBhcmFtIHRleHQgw5Z6ZXRsZW5lY2VrIFTDvHJrw6dlIG1ldGluXG4gKiBAcGFyYW0gbWF4U2VudGVuY2VzIMSwc3RlbmVuIG1ha3NpbXVtIGPDvG1sZSBzYXnEsXPEsSAoYmVsaXJ0aWxtZXpzZSBvdG9tYXRpayBoZXNhcGxhbsSxcilcbiAqIEByZXR1cm5zIMOWemV0IG1ldGluIChzZcOnaWxlbiBjw7xtbGVsZXIgb3JpamluYWwgc8SxcmFkYSBiaXJsZcWfdGlyaWxtacWfIG9sYXJhaylcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1bW1hcml6ZSh0ZXh0OiBzdHJpbmcsIG1heFNlbnRlbmNlcz86IG51bWJlcik6IHN0cmluZyB7XG4gIC8vIEtlbmFyIGR1cnVtbGFyOiBCb8WfIHZleWEgdGFuxLFtc8SxeiBtZXRpblxuICBpZiAoIXRleHQgfHwgIXRleHQudHJpbSgpKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgY29uc3QgdHJpbW1lZFRleHQgPSB0ZXh0LnRyaW0oKTtcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRJbnRvU2VudGVuY2VzKHRyaW1tZWRUZXh0KTtcblxuICAvLyBUZWsgY8O8bWxlIHZleWEgYm/FnyBheXLEscWfxLFtIGR1cnVtdVxuICBpZiAoc2VudGVuY2VzLmxlbmd0aCA8PSAxKSB7XG4gICAgcmV0dXJuIHRyaW1tZWRUZXh0O1xuICB9XG5cbiAgLy8gSGVkZWYgY8O8bWxlIHNhecSxc8SxIGJlbGlybGVtZSAodmFyc2F5xLFsYW46IG1heCgyLCBjZWlsKHRvdGFsICogMC4zKSkpXG4gIGNvbnN0IHRhcmdldENvdW50ID1cbiAgICB0eXBlb2YgbWF4U2VudGVuY2VzID09PSAnbnVtYmVyJyAmJiBtYXhTZW50ZW5jZXMgPiAwXG4gICAgICA/IG1heFNlbnRlbmNlc1xuICAgICAgOiBNYXRoLm1heCgyLCBNYXRoLmNlaWwoc2VudGVuY2VzLmxlbmd0aCAqIDAuMykpO1xuXG4gIC8vIE1ldGluZGVraSBjw7xtbGUgc2F5xLFzxLEgaGVkZWYgc2F5xLFkYW4gYXogdmV5YSBlxZ9pdHNlIG1ldG5pIG9sZHXEn3UgZ2liaSBkw7ZuZMO8clxuICBpZiAoc2VudGVuY2VzLmxlbmd0aCA8PSB0YXJnZXRDb3VudCkge1xuICAgIHJldHVybiB0cmltbWVkVGV4dDtcbiAgfVxuXG4gIC8vIDEuIEPDvG1sZWxlcmkgdG9rZW5pemUgZXRcbiAgY29uc3QgdG9rZW5pemVkU2VudGVuY2VzID0gc2VudGVuY2VzLm1hcCgoc2VudGVuY2UpID0+IHRva2VuaXplKHNlbnRlbmNlKSk7XG5cbiAgLy8gMi4gQ8O8bWxlbGVyIGFyYXPEsSBiZW56ZXJsaWsgbWF0cmlzaW5pIG9sdcWfdHVyXG4gIGNvbnN0IG4gPSBzZW50ZW5jZXMubGVuZ3RoO1xuICBjb25zdCBzaW1pbGFyaXR5TWF0cml4OiBudW1iZXJbXVtdID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogbiB9LCAoKSA9PlxuICAgIG5ldyBBcnJheShuKS5maWxsKDApXG4gICk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgIGNvbnN0IHNpbWlsYXJpdHkgPSBjYWxjdWxhdGVTaW1pbGFyaXR5KFxuICAgICAgICB0b2tlbml6ZWRTZW50ZW5jZXNbaV0sXG4gICAgICAgIHRva2VuaXplZFNlbnRlbmNlc1tqXVxuICAgICAgKTtcbiAgICAgIHNpbWlsYXJpdHlNYXRyaXhbaV1bal0gPSBzaW1pbGFyaXR5O1xuICAgICAgc2ltaWxhcml0eU1hdHJpeFtqXVtpXSA9IHNpbWlsYXJpdHk7XG4gICAgfVxuICB9XG5cbiAgLy8gMy4gUGFnZVJhbmsgYWxnb3JpdG1hc8SxIGlsZSBjw7xtbGUgc2tvcmxhcsSxbsSxIGhlc2FwbGFcbiAgY29uc3Qgc2NvcmVzID0gcnVuUGFnZVJhbmsoc2ltaWxhcml0eU1hdHJpeCwgMC44NSwgMzApO1xuXG4gIC8vIDQuIEPDvG1sZWxlcmkgc2tvcmxhcsSxbmEgZ8O2cmUgc8SxcmFsYSB2ZSBlbiB5w7xrc2VrIHNrb3JhIHNhaGlwIGlsayBOIGPDvG1sZXlpIHNlw6dcbiAgY29uc3QgaW5kZXhlZFNlbnRlbmNlcyA9IHNlbnRlbmNlcy5tYXAoKHNlbnRlbmNlLCBpbmRleCkgPT4gKHtcbiAgICBpbmRleCxcbiAgICBzZW50ZW5jZSxcbiAgICBzY29yZTogc2NvcmVzW2luZGV4XSA/PyAwXG4gIH0pKTtcblxuICAvLyBTa29yYSBnw7ZyZSBhemFsYW4gc8SxcmFsYVxuICBpbmRleGVkU2VudGVuY2VzLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcblxuICAvLyBFbiB5w7xrc2VrIHNrb3JsdSBpbGsgdGFyZ2V0Q291bnQgY8O8bWxleWkgYWxcbiAgY29uc3QgdG9wU2VudGVuY2VzID0gaW5kZXhlZFNlbnRlbmNlcy5zbGljZSgwLCB0YXJnZXRDb3VudCk7XG5cbiAgLy8gQ8O8bWxlbGVyaSBvcmlqaW5hbCBtZXRpbmRla2kgc8SxcmFzxLFuYSBnw7ZyZSB0ZWtyYXIgZGl6XG4gIHRvcFNlbnRlbmNlcy5zb3J0KChhLCBiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgLy8gQ8O8bWxlbGVyaSBhcmFsYXLEsW5kYSBib8WfbHVrIGLEsXJha2FyYWsgYmlybGXFn3RpclxuICByZXR1cm4gdG9wU2VudGVuY2VzLm1hcCgoaXRlbSkgPT4gaXRlbS5zZW50ZW5jZSkuam9pbignICcpO1xufVxuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbmltcG9ydCB7IFJlYWRhYmlsaXR5IH0gZnJvbSAnQG1vemlsbGEvcmVhZGFiaWxpdHknO1xuaW1wb3J0IHR5cGUgeyBDb250ZW50TWVzc2FnZSB9IGZyb20gJy4uL3NoYXJlZC9tZXNzYWdlcyc7XG5pbXBvcnQgdHlwZSB7IEdlc3R1cmVBY3Rpb24sIFJlYWRpbmdUaGVtZSB9IGZyb20gJy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBzdW1tYXJpemUgfSBmcm9tICcuLi9zaGFyZWQvdGV4dHJhbmsnO1xuXG5jb25zdCBUSEVNRVM6IFJlY29yZDxSZWFkaW5nVGhlbWUsIHsgYmc6IHN0cmluZzsgZmc6IHN0cmluZzsgbGluazogc3RyaW5nIH0+ID0ge1xuICBzZXBpYTogeyBiZzogJyNmNGVjZDgnLCBmZzogJyMzYjMyMjYnLCBsaW5rOiAnIzhiNWEyYicgfSxcbiAgZGFyazogeyBiZzogJyMxMjEyMTInLCBmZzogJyNkNmQ2ZDYnLCBsaW5rOiAnIzdhYTJmNycgfSxcbiAgbGlnaHQ6IHsgYmc6ICcjZmZmZmZmJywgZmc6ICcjMWYyMzI4JywgbGluazogJyMyNTYzZWInIH0sXG59O1xuXG5mdW5jdGlvbiBlc2NhcGVIdG1sKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1smPD5cIiddL2csIChjKSA9PlxuICAgICh7ICcmJzogJyZhbXA7JywgJzwnOiAnJmx0OycsICc+JzogJyZndDsnLCAnXCInOiAnJnF1b3Q7JywgXCInXCI6ICcmIzM5OycgfVtjXSEpLFxuICApO1xufVxuXG5mdW5jdGlvbiBidWlsZFJlYWRlckhUTUwodGl0bGU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCB0aGVtZTogUmVhZGluZ1RoZW1lKTogc3RyaW5nIHtcbiAgY29uc3QgdCA9IFRIRU1FU1t0aGVtZV07XG4gIHJldHVybiBgPCFkb2N0eXBlIGh0bWw+XG48aHRtbD5cbjxoZWFkPlxuPG1ldGEgY2hhcnNldD1cInV0Zi04XCI+XG48bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIj5cbjxzdHlsZT5cbiAgYm9keSB7IG1hcmdpbjogMDsgYmFja2dyb3VuZDogJHt0LmJnfTsgfVxuICAjcmVhZGVyIHtcbiAgICBtYXgtd2lkdGg6IDQyZW07IG1hcmdpbjogMCBhdXRvOyBwYWRkaW5nOiAyZW0gMS4yNWVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjc1OyBmb250LXNpemU6IDE4cHg7XG4gICAgZm9udC1mYW1pbHk6IEdlb3JnaWEsICdUaW1lcyBOZXcgUm9tYW4nLCBzZXJpZjsgY29sb3I6ICR7dC5mZ307XG4gIH1cbiAgI3JlYWRlciBoMSB7IGZvbnQtc2l6ZTogMS43ZW07IGxpbmUtaGVpZ2h0OiAxLjM7IG1hcmdpbjogMCAwIDAuNmVtOyB9XG4gICNyZWFkZXIgaDIsICNyZWFkZXIgaDMsICNyZWFkZXIgaDQgeyBsaW5lLWhlaWdodDogMS4zOyBtYXJnaW46IDEuMmVtIDAgMC41ZW07IH1cbiAgI3JlYWRlciBwIHsgbWFyZ2luOiAxZW0gMDsgfVxuICAjcmVhZGVyIGEgeyBjb2xvcjogJHt0Lmxpbmt9OyB9XG4gICNyZWFkZXIgaW1nLCAjcmVhZGVyIHZpZGVvLCAjcmVhZGVyIHBpY3R1cmUgeyBtYXgtd2lkdGg6IDEwMCU7IGhlaWdodDogYXV0bzsgZGlzcGxheTogYmxvY2s7IG1hcmdpbjogMWVtIGF1dG87IH1cbiAgI3JlYWRlciB1bCwgI3JlYWRlciBvbCB7IG1hcmdpbjogMWVtIDA7IHBhZGRpbmctbGVmdDogMS41ZW07IH1cbiAgI3JlYWRlciBsaSB7IG1hcmdpbjogMC4zZW0gMDsgfVxuICAjcmVhZGVyIGJsb2NrcXVvdGUgeyBib3JkZXItbGVmdDogM3B4IHNvbGlkICR7dC5saW5rfTsgbWFyZ2luOiAxZW0gMDsgcGFkZGluZzogMC41ZW0gMWVtOyBmb250LXN0eWxlOiBpdGFsaWM7IH1cbiAgI3JlYWRlciBwcmUgeyBiYWNrZ3JvdW5kOiByZ2JhKDEyOCwxMjgsMTI4LDAuMTIpOyBwYWRkaW5nOiAwLjc1ZW0gMWVtOyBvdmVyZmxvdy14OiBhdXRvOyB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7IH1cbiAgI3JlYWRlciBjb2RlLCAjcmVhZGVyIHByZSB7IGZvbnQtZmFtaWx5OiB1aS1tb25vc3BhY2UsIFNGTW9uby1SZWd1bGFyLCBtb25vc3BhY2U7IH1cbiAgI3JlYWRlciBmaWd1cmUgeyBtYXJnaW46IDAgMCAxLjVlbTsgfVxuICAjcmVhZGVyIGZpZ2NhcHRpb24geyBmb250LXNpemU6IDAuODVlbTsgb3BhY2l0eTogMC43NTsgbWFyZ2luLXRvcDogMC40ZW07IH1cbiAgI3JlYWRlciB0YWJsZSB7IGRpc3BsYXk6IGJsb2NrOyBtYXgtd2lkdGg6IDEwMCU7IG92ZXJmbG93LXg6IGF1dG87IGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7IH1cbjwvc3R5bGU+XG48L2hlYWQ+XG48Ym9keT5cbjxkaXYgaWQ9XCJyZWFkZXJcIj5cbiR7dGl0bGUgPyBgPGgxPiR7ZXNjYXBlSHRtbCh0aXRsZSl9PC9oMT5gIDogJyd9XG4ke2NvbnRlbnR9XG48L2Rpdj5cbjwvYm9keT5cbjwvaHRtbD5gO1xufVxuXG4vLyBCYXrEsSBzaXRlbGVyIGfDtnJzZWxsZXJpIGBkYXRhLXNyY2AgaWxlIGxhenktbG9hZCBlZGVyOyBSZWFkYWJpbGl0eSBidW5sYXLEsSBnw7ZybWV6LlxuZnVuY3Rpb24gcmVzb2x2ZUxhenlJbWFnZXMoZG9jOiBEb2N1bWVudCk6IHZvaWQge1xuICBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtc3JjXScpLmZvckVhY2goKGltZykgPT4ge1xuICAgIGNvbnN0IHNyYyA9IGltZy5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XG4gICAgaWYgKHNyYykgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjKTtcbiAgfSk7XG4gIGRvYy5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNzZXRdJykuZm9yRWFjaCgoaW1nKSA9PiB7XG4gICAgY29uc3QgcyA9IGltZy5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3Jjc2V0Jyk7XG4gICAgaWYgKHMpIGltZy5zZXRBdHRyaWJ1dGUoJ3NyY3NldCcsIHMpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0VGl0bGUoZG9jOiBEb2N1bWVudCwgZmFsbGJhY2s6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGgxID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ2gxJyk7XG4gIGNvbnN0IGgxVGV4dCA9IGgxPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICBpZiAoaDFUZXh0KSByZXR1cm4gaDFUZXh0O1xuICBjb25zdCBvZyA9IGRvYy5xdWVyeVNlbGVjdG9yKCdtZXRhW3Byb3BlcnR5PVwib2c6dGl0bGVcIl0nKT8uZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk/LnRyaW0oKTtcbiAgaWYgKG9nKSByZXR1cm4gb2c7XG4gIHJldHVybiBmYWxsYmFjayB8fCBkb2MudGl0bGUgfHwgJyc7XG59XG5cbmZ1bmN0aW9uIGdldExlYWRJbWFnZShkb2M6IERvY3VtZW50KTogc3RyaW5nIHwgbnVsbCB7XG4gIHJldHVybiBkb2MucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cIm9nOmltYWdlXCJdJyk/LmdldEF0dHJpYnV0ZSgnY29udGVudCcpID8/IG51bGw7XG59XG5cbmxldCBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgfCBudWxsID0gbnVsbDtcbmxldCBjbG9zZUJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbmxldCBsYXN0QXJ0aWNsZTogeyB0aXRsZTogc3RyaW5nOyBjb250ZW50OiBzdHJpbmcgfSB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiByZW5kZXJGcmFtZSh0aGVtZTogUmVhZGluZ1RoZW1lKTogdm9pZCB7XG4gIGlmICghbGFzdEFydGljbGUpIHJldHVybjtcblxuICBpZiAoIWZyYW1lKSB7XG4gICAgZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBmcmFtZS5pZCA9ICdyZWFkaW5nLWZyYW1lJztcbiAgICBmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NhbmRib3gnLCAnYWxsb3ctc2FtZS1vcmlnaW4nKTtcbiAgICBmcmFtZS5zdHlsZS5jc3NUZXh0ID1cbiAgICAgICdwb3NpdGlvbjogZml4ZWQ7IGluc2V0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBib3JkZXI6IDA7IHotaW5kZXg6IDIxNDc0ODM2NDc7IGJhY2tncm91bmQ6ICNmZmY7JztcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuXG4gICAgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjbG9zZUJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgY2xvc2VCdG4udGV4dENvbnRlbnQgPSAn4pyVJztcbiAgICBjbG9zZUJ0bi50aXRsZSA9ICdPa3VtYSBtb2R1bnUga2FwYXQnO1xuICAgIGNsb3NlQnRuLnN0eWxlLmNzc1RleHQgPVxuICAgICAgJ3Bvc2l0aW9uOiBmaXhlZDsgdG9wOiAxNHB4OyByaWdodDogMTRweDsgei1pbmRleDogMjE0NzQ4MzY0Nzsgd2lkdGg6IDM4cHg7IGhlaWdodDogMzhweDsgYm9yZGVyLXJhZGl1czogNTAlOyBib3JkZXI6IG5vbmU7IGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC41NSkgIWltcG9ydGFudDsgY29sb3I6ICNmZmYgIWltcG9ydGFudDsgZm9udC1zaXplOiAxOHB4ICFpbXBvcnRhbnQ7IGxpbmUtaGVpZ2h0OiAxOyBjdXJzb3I6IHBvaW50ZXI7JztcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRpc2FibGVSZWFkaW5nKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xuICB9XG5cbiAgZnJhbWUuc3JjZG9jID0gYnVpbGRSZWFkZXJIVE1MKGxhc3RBcnRpY2xlLnRpdGxlLCBsYXN0QXJ0aWNsZS5jb250ZW50LCB0aGVtZSk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZVJlYWRpbmcodGhlbWU6IFJlYWRpbmdUaGVtZSk6IGJvb2xlYW4ge1xuICBpZiAoZnJhbWUpIHtcbiAgICByZW5kZXJGcmFtZSh0aGVtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBjbG9uZSA9IGRvY3VtZW50LmNsb25lTm9kZSh0cnVlKSBhcyBEb2N1bWVudDtcbiAgcmVzb2x2ZUxhenlJbWFnZXMoY2xvbmUpO1xuICBjb25zdCBhcnRpY2xlID0gbmV3IFJlYWRhYmlsaXR5KGNsb25lKS5wYXJzZSgpO1xuICBjb25zdCBjb250ZW50ID0gYXJ0aWNsZT8uY29udGVudDtcbiAgaWYgKCFjb250ZW50KSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gQmHFn2zEscSfxLEgdmUgYW5hIGfDtnJzZWxpIHNheWZhZGFuIGtlbmRpbWl6IMOnxLFrYXLEsXlvcnV6IChSZWFkYWJpbGl0eSBiYXrEsVxuICAvLyBzaXRlbGVyZGUgeWFubMSxxZ8gYmHFn2zEsWsgc2XDp2ViaWxpeW9yLCBnw7Zyc2VsbGVyaSBkZSBnw7ZyZW1leWViaWxpeW9yKS5cbiAgY29uc3QgdGl0bGUgPSBnZXRUaXRsZShkb2N1bWVudCwgYXJ0aWNsZS50aXRsZSA/PyAnJyk7XG4gIGNvbnN0IGxlYWRJbWFnZSA9IGdldExlYWRJbWFnZShkb2N1bWVudCk7XG4gIGNvbnN0IGh0bWwgPSBsZWFkSW1hZ2VcbiAgICA/IGA8ZmlndXJlPjxpbWcgc3JjPVwiJHtlc2NhcGVIdG1sKGxlYWRJbWFnZSl9XCIgYWx0PVwiXCI+PC9maWd1cmU+YCArIGNvbnRlbnRcbiAgICA6IGNvbnRlbnQ7XG5cbiAgbGFzdEFydGljbGUgPSB7IHRpdGxlLCBjb250ZW50OiBodG1sIH07XG4gIHJlbmRlckZyYW1lKHRoZW1lKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGRpc2FibGVSZWFkaW5nKCk6IHZvaWQge1xuICBmcmFtZT8ucmVtb3ZlKCk7XG4gIGZyYW1lID0gbnVsbDtcbiAgY2xvc2VCdG4/LnJlbW92ZSgpO1xuICBjbG9zZUJ0biA9IG51bGw7XG4gIGxhc3RBcnRpY2xlID0gbnVsbDtcbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZhcmUgaGFyZWtldGxlcmkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbmxldCBnZXN0dXJlc0VuYWJsZWQgPSBmYWxzZTtcbmxldCB0cmFpbEVsOiBIVE1MRGl2RWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG5sZXQgZ1RyYWNraW5nID0gZmFsc2U7XG5sZXQgZ1N0YXJ0WCA9IDA7XG5sZXQgZ1N0YXJ0WSA9IDA7XG5sZXQgZ01vdmVkID0gZmFsc2U7XG5sZXQgZ1N1cHByZXNzTWVudSA9IGZhbHNlO1xuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoR2VzdHVyZXNGbGFnKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBkYXRhID0gKGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5nZXQoJ3NldHRpbmdzJykpIGFzIHtcbiAgICBzZXR0aW5ncz86IHsgZ2VzdHVyZXNFbmFibGVkPzogYm9vbGVhbiB9O1xuICB9O1xuICBnZXN0dXJlc0VuYWJsZWQgPSBkYXRhLnNldHRpbmdzPy5nZXN0dXJlc0VuYWJsZWQgPz8gZmFsc2U7XG59XG5cbi8qKlxuICogSGFuZ2kgZWtzZW5kZSBkYWhhIMOnb2sgaGFyZWtldCB2YXJzYSBvIHnDtm4ga2F6YW7EsXIuXG4gKiBFbiBheiA0MCBweCBoYXJla2V0IGdlcmVraXIuXG4gKi9cbmZ1bmN0aW9uIGRldGVjdERpcmVjdGlvbihcbiAgZHg6IG51bWJlcixcbiAgZHk6IG51bWJlcixcbik6IEdlc3R1cmVBY3Rpb24gfCAnc2Nyb2xsVG9wJyB8ICdzY3JvbGxCb3R0b20nIHwgbnVsbCB7XG4gIGNvbnN0IGF4ID0gTWF0aC5hYnMoZHgpO1xuICBjb25zdCBheSA9IE1hdGguYWJzKGR5KTtcbiAgaWYgKE1hdGgubWF4KGF4LCBheSkgPCA0MCkgcmV0dXJuIG51bGw7XG5cbiAgaWYgKGF4ID49IGF5KSByZXR1cm4gZHggPCAwID8gJ2JhY2snIDogJ2ZvcndhcmQnO1xuICByZXR1cm4gZHkgPCAwID8gJ3Njcm9sbFRvcCcgOiAnY2xvc2VUYWInO1xufVxuXG5mdW5jdGlvbiBzaG93VHJhaWwoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgaWYgKCF0cmFpbEVsKSB7XG4gICAgdHJhaWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRyYWlsRWwuc3R5bGUuY3NzVGV4dCA9XG4gICAgICAncG9zaXRpb246Zml4ZWQ7ei1pbmRleDoyMTQ3NDgzNjQ3O3BvaW50ZXItZXZlbnRzOm5vbmU7JyArXG4gICAgICAnd2lkdGg6MjRweDtoZWlnaHQ6MjRweDtib3JkZXItcmFkaXVzOjUwJTsnICtcbiAgICAgICdib3JkZXI6M3B4IHNvbGlkICMyNTYzZWI7YmFja2dyb3VuZDpyZ2JhKDM3LDk5LDIzNSwuMTgpOycgK1xuICAgICAgJ2JveC1zaGFkb3c6MCAwIDZweCByZ2JhKDAsMCwwLC4yNSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpOyc7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHRyYWlsRWwpO1xuICB9XG4gIHRyYWlsRWwuc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICB0cmFpbEVsLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xufVxuXG5mdW5jdGlvbiBoaWRlVHJhaWwoKTogdm9pZCB7XG4gIHRyYWlsRWw/LnJlbW92ZSgpO1xuICB0cmFpbEVsID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gcnVuQWN0aW9uKGFjdGlvbjogR2VzdHVyZUFjdGlvbiB8ICdzY3JvbGxUb3AnIHwgJ3Njcm9sbEJvdHRvbScpOiB2b2lkIHtcbiAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICBjYXNlICdzY3JvbGxUb3AnOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzY3JvbGxCb3R0b20nOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0LCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYWNrJzpcbiAgICAgIGhpc3RvcnkuYmFjaygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZm9yd2FyZCc6XG4gICAgICBoaXN0b3J5LmZvcndhcmQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JlbG9hZCc6XG4gICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Nsb3NlVGFiJzpcbiAgICBjYXNlICduZXdUYWInOlxuICAgICAgdHJ5IHtcbiAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ0dFU1RVUkUnLCBhY3Rpb24gfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzZXRHZXN0dXJlKCk6IHZvaWQge1xuICBnVHJhY2tpbmcgPSBmYWxzZTtcbiAgZ01vdmVkID0gZmFsc2U7XG4gIGhpZGVUcmFpbCgpO1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gw5Z6ZXQgcGFuZWxpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5sZXQgc3VtbWFyeU92ZXJsYXk6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIHNob3dTdW1tYXJ5T3ZlcmxheShzdW1tYXJ5OiBzdHJpbmcpOiB2b2lkIHtcbiAgY2xvc2VTdW1tYXJ5T3ZlcmxheSgpO1xuXG4gIHN1bW1hcnlPdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHN1bW1hcnlPdmVybGF5LmlkID0gJ3NhLXN1bW1hcnktb3ZlcmxheSc7XG4gIHN1bW1hcnlPdmVybGF5LnN0eWxlLmNzc1RleHQgPVxuICAgICdwb3NpdGlvbjpmaXhlZDtpbnNldDowO3otaW5kZXg6MjE0NzQ4MzY0NztkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7JyArXG4gICAgJ2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNDUpO2ZvbnQtZmFtaWx5OnN5c3RlbS11aSwtYXBwbGUtc3lzdGVtLHNhbnMtc2VyaWY7JztcblxuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuc3R5bGUuY3NzVGV4dCA9XG4gICAgJ2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMWYyMzI4O2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjI0cHggMjhweDttYXgtd2lkdGg6NTIwcHg7d2lkdGg6OTAlOycgK1xuICAgICdib3gtc2hhZG93OjAgOHB4IDMycHggcmdiYSgwLDAsMCwuMjUpO3Bvc2l0aW9uOnJlbGF0aXZlO21heC1oZWlnaHQ6NzB2aDtvdmVyZmxvdy15OmF1dG87JyArXG4gICAgJ2xpbmUtaGVpZ2h0OjEuNjU7Zm9udC1zaXplOjE1cHg7JztcblxuICBjb25zdCB0aXRsZUJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aXRsZUJhci5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47bWFyZ2luLWJvdHRvbToxNHB4Oyc7XG5cbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcbiAgdGl0bGUuc3R5bGUuY3NzVGV4dCA9ICdmb250LXNpemU6MTdweDtjb2xvcjojMGYxNzJhOyc7XG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ/Cfk4sgw5Z6ZXQnO1xuXG4gIGNvbnN0IGJ0bkdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJ0bkdyb3VwLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTpmbGV4O2dhcDo4cHg7JztcblxuICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvcHlCdG4udHlwZSA9ICdidXR0b24nO1xuICBjb3B5QnRuLnRleHRDb250ZW50ID0gJ0tvcHlhbGEnO1xuICBjb3B5QnRuLnN0eWxlLmNzc1RleHQgPVxuICAgICdib3JkZXI6MXB4IHNvbGlkICNkMWQ1ZGI7YmFja2dyb3VuZDojZjlmYWZiO2NvbG9yOiMzNzQxNTE7Ym9yZGVyLXJhZGl1czo2cHg7JyArXG4gICAgJ3BhZGRpbmc6NHB4IDEycHg7Zm9udC1zaXplOjEzcHg7Y3Vyc29yOnBvaW50ZXI7JztcbiAgY29weUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChzdW1tYXJ5KS50aGVuKCgpID0+IHtcbiAgICAgIGNvcHlCdG4udGV4dENvbnRlbnQgPSAnS29weWFsYW5kxLEg4pyTJztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBjb3B5QnRuLnRleHRDb250ZW50ID0gJ0tvcHlhbGEnOyB9LCAxNTAwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY2xvc2VCdG4udHlwZSA9ICdidXR0b24nO1xuICBjbG9zZUJ0bi50ZXh0Q29udGVudCA9ICfinJUnO1xuICBjbG9zZUJ0bi5zdHlsZS5jc3NUZXh0ID1cbiAgICAnYm9yZGVyOm5vbmU7YmFja2dyb3VuZDpub25lO2NvbG9yOiM2YjcyODA7Zm9udC1zaXplOjIwcHg7Y3Vyc29yOnBvaW50ZXI7cGFkZGluZzowIDRweDtsaW5lLWhlaWdodDoxOyc7XG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VTdW1tYXJ5T3ZlcmxheSk7XG5cbiAgYnRuR3JvdXAuYXBwZW5kKGNvcHlCdG4sIGNsb3NlQnRuKTtcbiAgdGl0bGVCYXIuYXBwZW5kKHRpdGxlLCBidG5Hcm91cCk7XG5cbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgYm9keS5zdHlsZS5jc3NUZXh0ID0gJ21hcmdpbjowO3doaXRlLXNwYWNlOnByZS13cmFwOyc7XG4gIGJvZHkudGV4dENvbnRlbnQgPSBzdW1tYXJ5O1xuXG4gIGNhcmQuYXBwZW5kKHRpdGxlQmFyLCBib2R5KTtcbiAgc3VtbWFyeU92ZXJsYXkuYXBwZW5kQ2hpbGQoY2FyZCk7XG5cbiAgLy8gRMSxxZ9hcsSxIHTEsWtsYXnEsW5jYSBrYXBhdC5cbiAgc3VtbWFyeU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldCA9PT0gc3VtbWFyeU92ZXJsYXkpIGNsb3NlU3VtbWFyeU92ZXJsYXkoKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHN1bW1hcnlPdmVybGF5KTtcblxuICAvLyBFc2NhcGUgaWxlIGthcGF0LlxuICBjb25zdCBvbktleSA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgY2xvc2VTdW1tYXJ5T3ZlcmxheSgpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSwgdHJ1ZSk7XG4gICAgfVxuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5LCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VTdW1tYXJ5T3ZlcmxheSgpOiB2b2lkIHtcbiAgc3VtbWFyeU92ZXJsYXk/LnJlbW92ZSgpO1xuICBzdW1tYXJ5T3ZlcmxheSA9IG51bGw7XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBDb250ZW50IFNjcmlwdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29udGVudFNjcmlwdCh7XG4gIG1hdGNoZXM6IFsnPGFsbF91cmxzPiddLFxuICBtYWluKGN0eCkge1xuICAgIGN0eC5vbkludmFsaWRhdGVkKCgpID0+IGxvY2F0aW9uLnJlbG9hZCgpKTtcblxuICAgIC8vIOKUgOKUgCBNZXNhaiBkaW5sZXlpY2lzaSDilIDilIBcbiAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuICAgICAgKG1lc3NhZ2U6IENvbnRlbnRNZXNzYWdlLCBfc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ1NFVF9SRUFESU5HX01PREUnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9rID0gbWVzc2FnZS5lbmFibGVkID8gZW5hYmxlUmVhZGluZyhtZXNzYWdlLnRoZW1lKSA6IChkaXNhYmxlUmVhZGluZygpLCB0cnVlKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IG9rIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignT2t1bWEgbW9kdSBoYXRhc8SxOicsIGVycik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVyciksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnU0hPV19TVU1NQVJZJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWttZSBBc2lzdGFuxLE6IFNIT1dfU1VNTUFSWSBtZXNhasSxIGFsxLFuZMSxLicsIG1lc3NhZ2Uuc3VtbWFyeSk7XG4gICAgICAgICAgc2hvd1N1bW1hcnlPdmVybGF5KG1lc3NhZ2Uuc3VtbWFyeSk7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnU1VNTUFSSVpFX1BBR0UnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1Nla21lIEFzaXN0YW7EsTogU1VNTUFSSVpFX1BBR0UgbWVzYWrEsSBhbMSxbmTEsS4nKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBkb2N1bWVudC5jbG9uZU5vZGUodHJ1ZSkgYXMgRG9jdW1lbnQ7XG4gICAgICAgICAgICByZXNvbHZlTGF6eUltYWdlcyhjbG9uZSk7XG4gICAgICAgICAgICBjb25zdCBhcnRpY2xlID0gbmV3IFJlYWRhYmlsaXR5KGNsb25lKS5wYXJzZSgpO1xuICAgICAgICAgICAgaWYgKGFydGljbGUgJiYgYXJ0aWNsZS50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gc3VtbWFyaXplKGFydGljbGUudGV4dENvbnRlbnQsIDUpOyAvLyBUw7xtIHNheWZhZGEgZGFoYSBmYXpsYSBjw7xtbGUgKDUpIGt1bGxhblxuICAgICAgICAgICAgICBzaG93U3VtbWFyeU92ZXJsYXkoc3VtbWFyeSB8fCAnQnUgc2F5ZmFkYW4gw7Z6ZXRsZW5lY2VrIHlldGVybGkgbWV0aW4gYnVsdW5hbWFkxLEuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzaG93U3VtbWFyeU92ZXJsYXkoJ0J1IHNheWZhZGFuIGnDp2VyaWsgw6fEsWthcsSxbGFtYWTEsSAoYmVsa2kgbWFrYWxlIGRlxJ9pbCB2ZXlhIMOnb2sga8Sxc2EpLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTYXlmYSDDtnpldGxlbWUgaGF0YXPEsTonLCBlcnIpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICApO1xuXG4gICAgLy8g4pSA4pSAIEZhcmUgaGFyZWtldGxlcmkgYmHFn2xhdG1hIOKUgOKUgFxuICAgIHZvaWQgcmVmcmVzaEdlc3R1cmVzRmxhZygpO1xuICAgIGJyb3dzZXIuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgICAgIGlmIChhcmVhID09PSAnbG9jYWwnICYmIGNoYW5nZXMuc2V0dGluZ3MpIHtcbiAgICAgICAgZ2VzdHVyZXNFbmFibGVkID1cbiAgICAgICAgICAoY2hhbmdlcy5zZXR0aW5ncy5uZXdWYWx1ZSBhcyB7IGdlc3R1cmVzRW5hYmxlZD86IGJvb2xlYW4gfSB8IHVuZGVmaW5lZClcbiAgICAgICAgICAgID8uZ2VzdHVyZXNFbmFibGVkID8/IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g4pSA4pSAIE9sYXkgZGlubGV5aWNpbGVyaSDilIDilIBcbiAgICAvL1xuICAgIC8vIGB3aW5kb3dgIMO8emVyaW5kZSBjYXB0dXJlIGZhesSxbmRhIGRpbmxpeW9ydXouXG4gICAgLy8gQ2FwdHVyZSBha8SxxZ/EsTogd2luZG93IOKGkiBkb2N1bWVudCDihpIg4oCmIOKGkiBoZWRlZlxuICAgIC8vIFlvdVR1YmUgZ2liaSBzaXRlbGVyIGRvY3VtZW50IMO8emVyaW5kZSBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKVxuICAgIC8vIMOnYcSfxLFyc2EgYmlsZSBiaXppbSBkaW5sZXlpY2ltaXogZGFoYSDDtm5jZSB0ZXRpa2xlbmlyLlxuICAgIC8vXG4gICAgLy8gQWvEscWfOiBtb3VzZWRvd24oMikg4oaSIG1vdXNlbW92ZeKApiDihpIgbW91c2V1cCgyKSDihpIgY29udGV4dG1lbnVcblxuICAgIC8vIOKRoCBTYcSfIHR1xZ9hIGJhcyDihpIgaXpsZW1leWkgYmHFn2xhdC5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdtb3VzZWRvd24nLFxuICAgICAgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGUuYnV0dG9uICE9PSAyIHx8ICFnZXN0dXJlc0VuYWJsZWQpIHJldHVybjtcbiAgICAgICAgZ1RyYWNraW5nID0gdHJ1ZTtcbiAgICAgICAgZ01vdmVkID0gZmFsc2U7XG4gICAgICAgIGdTdXBwcmVzc01lbnUgPSBmYWxzZTtcbiAgICAgICAgZ1N0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgZ1N0YXJ0WSA9IGUuY2xpZW50WTtcbiAgICAgIH0sXG4gICAgICB0cnVlLFxuICAgICk7XG5cbiAgICAvLyDikaEgRmFyZSBoYXJla2V0IGV0dGlrw6dlIGl6IGfDtnN0ZXIuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmICghZ1RyYWNraW5nKSByZXR1cm47XG4gICAgICAgIGlmICghZ01vdmVkICYmIE1hdGguaHlwb3QoZS5jbGllbnRYIC0gZ1N0YXJ0WCwgZS5jbGllbnRZIC0gZ1N0YXJ0WSkgPiAzMCkge1xuICAgICAgICAgIGdNb3ZlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdNb3ZlZCkgc2hvd1RyYWlsKGUuY2xpZW50WCwgZS5jbGllbnRZKTtcbiAgICAgIH0sXG4gICAgICB0cnVlLFxuICAgICk7XG5cbiAgICAvLyDikaIgU2HEnyB0dcWfdSBixLFyYWsg4oaSIHnDtm7DvCBhbGfEsWxhLCBleWxlbWkgecO8csO8dC5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdtb3VzZXVwJyxcbiAgICAgIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChlLmJ1dHRvbiAhPT0gMiB8fCAhZ1RyYWNraW5nKSByZXR1cm47XG5cbiAgICAgICAgaWYgKGdNb3ZlZCkge1xuICAgICAgICAgIGdTdXBwcmVzc01lbnUgPSB0cnVlO1xuICAgICAgICAgIGNvbnN0IGRpciA9IGRldGVjdERpcmVjdGlvbihlLmNsaWVudFggLSBnU3RhcnRYLCBlLmNsaWVudFkgLSBnU3RhcnRZKTtcbiAgICAgICAgICBpZiAoZGlyKSBydW5BY3Rpb24oZGlyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0R2VzdHVyZSgpO1xuICAgICAgfSxcbiAgICAgIHRydWUsXG4gICAgKTtcblxuICAgIC8vIOKRoyBjb250ZXh0bWVudSDigJQgaGFyZWtldCB5YXDEsWxkxLF5c2EgZW5nZWxsZSwgeWFwxLFsbWFkxLF5c2EgYcOnxLFsc8Sxbi5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjb250ZXh0bWVudScsXG4gICAgICAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGdTdXBwcmVzc01lbnUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBnU3VwcHJlc3NNZW51ID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnZXN0dXJlc0VuYWJsZWQgJiYgZ1RyYWNraW5nKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0cnVlLFxuICAgICk7XG4gIH0sXG59KTtcbiIsIi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLnRzXG5mdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcblx0aWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuXHRpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIG1ldGhvZChgW3d4dF0gJHthcmdzLnNoaWZ0KCl9YCwgLi4uYXJncyk7XG5cdGVsc2UgbWV0aG9kKFwiW3d4dF1cIiwgLi4uYXJncyk7XG59XG4vKiogV3JhcHBlciBhcm91bmQgYGNvbnNvbGVgIHdpdGggYSBcIlt3eHRdXCIgcHJlZml4ICovXG5jb25zdCBsb2dnZXIgPSB7XG5cdGRlYnVnOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5kZWJ1ZywgLi4uYXJncyksXG5cdGxvZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUubG9nLCAuLi5hcmdzKSxcblx0d2FybjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUud2FybiwgLi4uYXJncyksXG5cdGVycm9yOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5lcnJvciwgLi4uYXJncylcbn07XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGxvZ2dlciB9O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xuXHRjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuXHRcdHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuXHRcdHRoaXMubmV3VXJsID0gbmV3VXJsO1xuXHRcdHRoaXMub2xkVXJsID0gb2xkVXJsO1xuXHR9XG59O1xuLyoqXG4qIFJldHVybnMgYW4gZXZlbnQgbmFtZSB1bmlxdWUgdG8gdGhlIGV4dGVuc2lvbiBhbmQgY29udGVudCBzY3JpcHQgdGhhdCdzXG4qIHJ1bm5pbmcuXG4qL1xuZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuXHRyZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQsIGdldFVuaXF1ZUV2ZW50TmFtZSB9O1xuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIudHNcbmNvbnN0IHN1cHBvcnRzTmF2aWdhdGlvbkFwaSA9IHR5cGVvZiBnbG9iYWxUaGlzLm5hdmlnYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwiZnVuY3Rpb25cIjtcbi8qKlxuKiBDcmVhdGUgYSB1dGlsIHRoYXQgd2F0Y2hlcyBmb3IgVVJMIGNoYW5nZXMsIGRpc3BhdGNoaW5nIHRoZSBjdXN0b20gZXZlbnQgd2hlblxuKiBkZXRlY3RlZC4gU3RvcHMgd2F0Y2hpbmcgd2hlbiBjb250ZW50IHNjcmlwdCBpcyBpbnZhbGlkYXRlZC4gVXNlcyBOYXZpZ2F0aW9uXG4qIEFQSSB3aGVuIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGZhbGxzIGJhY2sgdG8gcG9sbGluZy5cbiovXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG5cdGxldCBsYXN0VXJsO1xuXHRsZXQgd2F0Y2hpbmcgPSBmYWxzZTtcblx0cmV0dXJuIHsgcnVuKCkge1xuXHRcdGlmICh3YXRjaGluZykgcmV0dXJuO1xuXHRcdHdhdGNoaW5nID0gdHJ1ZTtcblx0XHRsYXN0VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRpZiAoc3VwcG9ydHNOYXZpZ2F0aW9uQXBpKSBnbG9iYWxUaGlzLm5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3VXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmID09PSBsYXN0VXJsLmhyZWYpIHJldHVybjtcblx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgbGFzdFVybCkpO1xuXHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHR9LCB7IHNpZ25hbDogY3R4LnNpZ25hbCB9KTtcblx0XHRlbHNlIGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmICE9PSBsYXN0VXJsLmhyZWYpIHtcblx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRcdGxhc3RVcmwgPSBuZXdVcmw7XG5cdFx0XHR9XG5cdFx0fSwgMWUzKTtcblx0fSB9O1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfTtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL2ludGVybmFsL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0LnRzXG4vKipcbiogSW1wbGVtZW50c1xuKiBbYEFib3J0Q29udHJvbGxlcmBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BYm9ydENvbnRyb2xsZXIpLlxuKiBVc2VkIHRvIGRldGVjdCBhbmQgc3RvcCBjb250ZW50IHNjcmlwdCBjb2RlIHdoZW4gdGhlIHNjcmlwdCBpcyBpbnZhbGlkYXRlZC5cbipcbiogSXQgYWxzbyBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdGllcyBsaWtlIGBjdHguc2V0VGltZW91dGAgYW5kXG4qIGBjdHguc2V0SW50ZXJ2YWxgIHRoYXQgc2hvdWxkIGJlIHVzZWQgaW4gY29udGVudCBzY3JpcHRzIGluc3RlYWQgb2ZcbiogYHdpbmRvdy5zZXRUaW1lb3V0YCBvciBgd2luZG93LnNldEludGVydmFsYC5cbipcbiogVG8gY3JlYXRlIGNvbnRleHQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gdXNlIHRoZSBjbGFzcydzIGNvbnN0cnVjdG9yOlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9IGZyb20gJ3d4dC91dGlscy9jb250ZW50LXNjcmlwdHMtY29udGV4dCc7XG4qXG4qIHRlc3QoJ3N0b3JhZ2UgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiBjb250ZXh0IGlzIGludmFsaWRhdGVkJywgKCkgPT4ge1xuKiAgIGNvbnN0IGN0eCA9IG5ldyBDb250ZW50U2NyaXB0Q29udGV4dCgndGVzdCcpO1xuKiAgIGNvbnN0IGl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW0oJ2xvY2FsOmNvdW50JywgeyBkZWZhdWx0VmFsdWU6IDAgfSk7XG4qICAgY29uc3Qgd2F0Y2hlciA9IHZpLmZuKCk7XG4qXG4qICAgY29uc3QgdW53YXRjaCA9IGl0ZW0ud2F0Y2god2F0Y2hlcik7XG4qICAgY3R4Lm9uSW52YWxpZGF0ZWQodW53YXRjaCk7IC8vIExpc3RlbiBmb3IgaW52YWxpZGF0ZSBoZXJlXG4qXG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgxKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkV2l0aCgxLCAwKTtcbipcbiogICBjdHgubm90aWZ5SW52YWxpZGF0ZWQoKTsgLy8gVXNlIHRoaXMgZnVuY3Rpb24gdG8gaW52YWxpZGF0ZSB0aGUgY29udGV4dFxuKiAgIGF3YWl0IGl0ZW0uc2V0VmFsdWUoMik7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRUaW1lcygxKTtcbiogfSk7XG4qIGBgYFxuKi9cbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcblx0c3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCIpO1xuXHRpZDtcblx0YWJvcnRDb250cm9sbGVyO1xuXHRsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG5cdGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXHRcdHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcblx0XHR0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuXHR9XG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcblx0fVxuXHRhYm9ydChyZWFzb24pIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcblx0fVxuXHRnZXQgaXNJbnZhbGlkKCkge1xuXHRcdGlmIChicm93c2VyLnJ1bnRpbWU/LmlkID09IG51bGwpIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHRyZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcblx0fVxuXHRnZXQgaXNWYWxpZCgpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuXHR9XG5cdC8qKlxuXHQqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpc1xuXHQqIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuXHQqICAgY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcblx0KiAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG5cdCogICB9KTtcblx0KiAgIC8vIC4uLlxuXHQqICAgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuXHQqXG5cdCogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuXHQqL1xuXHRvbkludmFsaWRhdGVkKGNiKSB7XG5cdFx0dGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0XHRyZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0fVxuXHQvKipcblx0KiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvblxuXHQqIHRoYXQgc2hvdWxkbid0IHJ1biBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG5cdCogICAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG5cdCpcblx0KiAgICAgLy8gLi4uXG5cdCogICB9O1xuXHQqL1xuXHRibG9jaygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIEludGVydmFscyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNsZWFySW50ZXJ2YWxgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG5cdFx0Y29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbFxuXHQqIHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBUaW1lb3V0cyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYHNldFRpbWVvdXRgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzXG5cdCogdGhlIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxBbmltYXRpb25GcmFtZWBcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cdFx0Y29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdH0pO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZVxuXHQqIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxJZGxlQ2FsbGJhY2tgXG5cdCogZnVuY3Rpb24uXG5cdCovXG5cdHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSwgb3B0aW9ucyk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHRhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuXHRcdGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcblx0XHR9XG5cdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/Lih0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSwgaGFuZGxlciwge1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdHNpZ25hbDogdGhpcy5zaWduYWxcblx0XHR9KTtcblx0fVxuXHQvKipcblx0KiBAaW50ZXJuYWxcblx0KiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cblx0Ki9cblx0bm90aWZ5SW52YWxpZGF0ZWQoKSB7XG5cdFx0dGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG5cdFx0bG9nZ2VyLmRlYnVnKGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYCk7XG5cdH1cblx0c3RvcE9sZFNjcmlwdHMoKSB7XG5cdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCB7IGRldGFpbDoge1xuXHRcdFx0Y29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG5cdFx0XHRtZXNzYWdlSWQ6IHRoaXMuaWRcblx0XHR9IH0pKTtcblx0XHRpZiAoIXRoaXMub3B0aW9ucz8ubm9TY3JpcHRTdGFydGVkUG9zdE1lc3NhZ2UpIHdpbmRvdy5wb3N0TWVzc2FnZSh7XG5cdFx0XHR0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0sIFwiKlwiKTtcblx0fVxuXHR2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcblx0XHRjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGV0YWlsPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcblx0XHRjb25zdCBpc0Zyb21TZWxmID0gZXZlbnQuZGV0YWlsPy5tZXNzYWdlSWQgPT09IHRoaXMuaWQ7XG5cdFx0cmV0dXJuIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgIWlzRnJvbVNlbGY7XG5cdH1cblx0bGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuXHRcdGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAoIShldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSB8fCAhdGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSByZXR1cm47XG5cdFx0XHR0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpKTtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgQ29udGVudFNjcmlwdENvbnRleHQgfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsMyw0LDUsOCw5LDEwLDExXSwibWFwcGluZ3MiOiI7Ozs7O0NBQ0EsU0FBUyxvQkFBb0IsWUFBWTtFQUN4QyxPQUFPO0NBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7O0NFYUEsSUFBTSxVRGZpQixXQUFXLFNBQVMsU0FBUyxLQUNoRCxXQUFXLFVBQ1gsV0FBVzs7Ozs7Ozs7O0VFdUJmLFNBQVMsWUFBWSxLQUFLLFNBQVM7R0FFakMsSUFBSSxXQUFXLFFBQVEsaUJBQWlCO0lBQ3RDLE1BQU07SUFDTixVQUFVLFVBQVU7R0FDdEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksaUJBQ3RCLE1B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LElBQUEsVUFBQTtDQUNBLElBQUEsVUFBQTtDQUNBLElBQUEsU0FBQTtDQUNBLElBQUEsZ0JBQUE7Q0FFQSxlQUFBLHNCQUFBO0VBSUUsbUJBQUEsTUFIQSxRQUFBLFFBQUEsTUFBQSxJQUFBLFVBQUEsRUFBQSxDQUdBLFVBQUEsbUJBQUE7Q0FDRjs7Ozs7Q0FNQSxTQUFBLGdCQUFBLElBQUEsSUFBQTtFQUlFLE1BQUEsS0FBQSxLQUFBLElBQUEsRUFBQTtFQUNBLE1BQUEsS0FBQSxLQUFBLElBQUEsRUFBQTtFQUNBLElBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsT0FBQTtFQUVBLElBQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxJQUFBLFNBQUE7RUFDQSxPQUFBLEtBQUEsSUFBQSxjQUFBO0NBQ0Y7Q0FFQSxTQUFBLFVBQUEsR0FBQSxHQUFBO0VBQ0UsSUFBQSxDQUFBLFNBQUE7R0FDRSxVQUFBLFNBQUEsY0FBQSxLQUFBO0dBQ0EsUUFBQSxNQUFBLFVBQUE7R0FLQSxTQUFBLGdCQUFBLFlBQUEsT0FBQTtFQUNGO0VBQ0EsUUFBQSxNQUFBLE9BQUEsSUFBQTtFQUNBLFFBQUEsTUFBQSxNQUFBLElBQUE7Q0FDRjtDQUVBLFNBQUEsWUFBQTtFQUNFLFNBQUEsT0FBQTtFQUNBLFVBQUE7Q0FDRjtDQUVBLFNBQUEsVUFBQSxRQUFBO0VBQ0UsUUFBQSxRQUFBO0dBQ0UsS0FBQTtJQUNFLE9BQUEsU0FBQTtLQUFrQixLQUFBO0tBQVEsVUFBQTtJQUFtQixDQUFBO0lBQzdDO0dBQ0YsS0FBQTtJQUNFLE9BQUEsU0FBQTtLQUFrQixLQUFBLFNBQUEsZ0JBQUE7S0FBNEMsVUFBQTtJQUFtQixDQUFBO0lBQ2pGO0dBQ0YsS0FBQTtJQUNFLFFBQUEsS0FBQTtJQUNBO0dBQ0YsS0FBQTtJQUNFLFFBQUEsUUFBQTtJQUNBO0dBQ0YsS0FBQTtJQUNFLFNBQUEsT0FBQTtJQUNBO0dBQ0YsS0FBQTtHQUNBLEtBQUEsVUFDRSxJQUFBO0lBQ0UsUUFBQSxRQUFBLFlBQUE7S0FBOEIsTUFBQTtLQUFpQjtJQUFPLENBQUEsQ0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBO0dBQ3hELFFBQUE7SUFDRSxTQUFBLE9BQUE7R0FDRjtFQUVKO0NBQ0Y7Q0FFQSxTQUFBLGVBQUE7RUFDRSxZQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7Q0FDRjtDQUlBLElBQUEsaUJBQUE7Q0FFQSxTQUFBLG1CQUFBLFNBQUE7RUFDRSxvQkFBQTtFQUVBLGlCQUFBLFNBQUEsY0FBQSxLQUFBO0VBQ0EsZUFBQSxLQUFBO0VBQ0EsZUFBQSxNQUFBLFVBQUE7RUFJQSxNQUFBLE9BQUEsU0FBQSxjQUFBLEtBQUE7RUFDQSxLQUFBLE1BQUEsVUFBQTtFQUtBLE1BQUEsV0FBQSxTQUFBLGNBQUEsS0FBQTtFQUNBLFNBQUEsTUFBQSxVQUFBO0VBRUEsTUFBQSxRQUFBLFNBQUEsY0FBQSxRQUFBO0VBQ0EsTUFBQSxNQUFBLFVBQUE7RUFDQSxNQUFBLGNBQUE7RUFFQSxNQUFBLFdBQUEsU0FBQSxjQUFBLEtBQUE7RUFDQSxTQUFBLE1BQUEsVUFBQTtFQUVBLE1BQUEsVUFBQSxTQUFBLGNBQUEsUUFBQTtFQUNBLFFBQUEsT0FBQTtFQUNBLFFBQUEsY0FBQTtFQUNBLFFBQUEsTUFBQSxVQUFBO0VBR0EsUUFBQSxpQkFBQSxlQUFBO0dBQ0UsVUFBQSxVQUFBLFVBQUEsT0FBQSxDQUFBLENBQUEsV0FBQTtJQUNFLFFBQUEsY0FBQTtJQUNBLGlCQUFBO0tBQW1CLFFBQUEsY0FBQTtJQUFpQyxHQUFBLElBQUE7R0FDdEQsQ0FBQTtFQUNGLENBQUE7RUFFQSxNQUFBLFdBQUEsU0FBQSxjQUFBLFFBQUE7RUFDQSxTQUFBLE9BQUE7RUFDQSxTQUFBLGNBQUE7RUFDQSxTQUFBLE1BQUEsVUFBQTtFQUVBLFNBQUEsaUJBQUEsU0FBQSxtQkFBQTtFQUVBLFNBQUEsT0FBQSxTQUFBLFFBQUE7RUFDQSxTQUFBLE9BQUEsT0FBQSxRQUFBO0VBRUEsTUFBQSxPQUFBLFNBQUEsY0FBQSxHQUFBO0VBQ0EsS0FBQSxNQUFBLFVBQUE7RUFDQSxLQUFBLGNBQUE7RUFFQSxLQUFBLE9BQUEsVUFBQSxJQUFBO0VBQ0EsZUFBQSxZQUFBLElBQUE7RUFHQSxlQUFBLGlCQUFBLFVBQUEsTUFBQTtHQUNFLElBQUEsRUFBQSxXQUFBLGdCQUFBLG9CQUFBO0VBQ0YsQ0FBQTtFQUVBLFNBQUEsZ0JBQUEsWUFBQSxjQUFBO0VBR0EsTUFBQSxTQUFBLE1BQUE7R0FDRSxJQUFBLEVBQUEsUUFBQSxVQUFBO0lBQ0Usb0JBQUE7SUFDQSxPQUFBLG9CQUFBLFdBQUEsT0FBQSxJQUFBO0dBQ0Y7RUFDRjtFQUNBLE9BQUEsaUJBQUEsV0FBQSxPQUFBLElBQUE7Q0FDRjtDQUVBLFNBQUEsc0JBQUE7RUFDRSxnQkFBQSxPQUFBO0VBQ0EsaUJBQUE7Q0FDRjtDQUlBLElBQUEsa0JBQUEsb0JBQUE7RUFDRSxTQUFBLENBQUEsWUFBQTtFQUNBLEtBQUEsS0FBQTtHQUNFLElBQUEsb0JBQUEsU0FBQSxPQUFBLENBQUE7R0FHQSxRQUFBLFFBQUEsVUFBQSxhQUFBLFNBQUEsU0FBQSxpQkFBQTtJQUVJLElBQUEsUUFBQSxTQUFBLG9CQUNFLElBQUE7S0FFRSxhQUFBLEVBQUEsSUFEQSxRQUFBLFVBQUEsY0FBQSxRQUFBLEtBQUEsS0FBQSxlQUFBLEdBQUEsTUFDQSxDQUFBO0lBQ0YsU0FBQSxLQUFBO0tBQ0UsUUFBQSxNQUFBLHNCQUFBLEdBQUE7S0FDQSxhQUFBO01BQ0UsSUFBQTtNQUNBLE9BQUEsZUFBQSxRQUFBLElBQUEsVUFBQSxPQUFBLEdBQUE7S0FDRixDQUFBO0lBQ0Y7U0FDRixJQUFBLFFBQUEsU0FBQSxnQkFBQTtLQUNFLFFBQUEsSUFBQSwrQ0FBQSxRQUFBLE9BQUE7S0FDQSxtQkFBQSxRQUFBLE9BQUE7S0FDQSxhQUFBLEVBQUEsSUFBQSxLQUFBLENBQUE7SUFDRixPQUFBLElBQUEsUUFBQSxTQUFBLGtCQUFBO0tBQ0UsUUFBQSxJQUFBLCtDQUFBO0tBQ0EsSUFBQTtNQUNFLE1BQUEsUUFBQSxTQUFBLFVBQUEsSUFBQTtNQUNBLGtCQUFBLEtBQUE7TUFDQSxNQUFBLFVBQUEsSUFBQSxtQkFBQSxZQUFBLEtBQUEsQ0FBQSxDQUFBLE1BQUE7TUFDQSxJQUFBLFdBQUEsUUFBQSxhQUVFLG1CQURBLFVBQUEsUUFBQSxhQUFBLENBQ0EsS0FBQSxtREFBQTtXQUVBLG1CQUFBLHFFQUFBO01BRUYsYUFBQSxFQUFBLElBQUEsS0FBQSxDQUFBO0tBQ0YsU0FBQSxLQUFBO01BQ0UsUUFBQSxNQUFBLDBCQUFBLEdBQUE7TUFDQSxhQUFBLEVBQUEsSUFBQSxNQUFBLENBQUE7S0FDRjtJQUNGO0dBQ0YsQ0FBQTtHQUlGLG9CQUFBO0dBQ0EsUUFBQSxRQUFBLFVBQUEsYUFBQSxTQUFBLFNBQUE7SUFDRSxJQUFBLFNBQUEsV0FBQSxRQUFBLFVBQ0Usa0JBQUEsUUFBQSxTQUFBLFVBQUEsbUJBQUE7R0FJSixDQUFBO0dBWUEsT0FBQSxpQkFBQSxjQUFBLE1BQUE7SUFHSSxJQUFBLEVBQUEsV0FBQSxLQUFBLENBQUEsaUJBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQTtJQUNBLGdCQUFBO0lBQ0EsVUFBQSxFQUFBO0lBQ0EsVUFBQSxFQUFBO0dBQ0YsR0FBQSxJQUFBO0dBS0YsT0FBQSxpQkFBQSxjQUFBLE1BQUE7SUFHSSxJQUFBLENBQUEsV0FBQTtJQUNBLElBQUEsQ0FBQSxVQUFBLEtBQUEsTUFBQSxFQUFBLFVBQUEsU0FBQSxFQUFBLFVBQUEsT0FBQSxJQUFBLElBQ0UsU0FBQTtJQUVGLElBQUEsUUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUE7R0FDRixHQUFBLElBQUE7R0FLRixPQUFBLGlCQUFBLFlBQUEsTUFBQTtJQUdJLElBQUEsRUFBQSxXQUFBLEtBQUEsQ0FBQSxXQUFBO0lBRUEsSUFBQSxRQUFBO0tBQ0UsZ0JBQUE7S0FDQSxNQUFBLE1BQUEsZ0JBQUEsRUFBQSxVQUFBLFNBQUEsRUFBQSxVQUFBLE9BQUE7S0FDQSxJQUFBLEtBQUEsVUFBQSxHQUFBO0lBQ0Y7SUFFQSxhQUFBO0dBQ0YsR0FBQSxJQUFBO0dBS0YsT0FBQSxpQkFBQSxnQkFBQSxNQUFBO0lBR0ksSUFBQSxlQUFBO0tBQ0UsRUFBQSxlQUFBO0tBQ0EsRUFBQSx5QkFBQTtLQUNBLGdCQUFBO0tBQ0E7SUFDRjtJQUNBLElBQUEsbUJBQUEsV0FBQTtLQUNFLEVBQUEsZUFBQTtLQUNBLEVBQUEseUJBQUE7SUFDRjtHQUNGLEdBQUEsSUFBQTtFQUdKO0NBQ0YsQ0FBQTs7O0NDcGJBLFNBQVNDLFFBQU0sUUFBUSxHQUFHLE1BQU07RUFFL0IsSUFBSSxPQUFPLEtBQUssT0FBTyxVQUFVLE9BQU8sU0FBUyxLQUFLLE1BQU0sS0FBSyxHQUFHLElBQUk7T0FDbkUsT0FBTyxTQUFTLEdBQUcsSUFBSTtDQUM3Qjs7Q0FFQSxJQUFNQyxXQUFTO0VBQ2QsUUFBUSxHQUFHLFNBQVNELFFBQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtFQUNoRCxNQUFNLEdBQUcsU0FBU0EsUUFBTSxRQUFRLEtBQUssR0FBRyxJQUFJO0VBQzVDLE9BQU8sR0FBRyxTQUFTQSxRQUFNLFFBQVEsTUFBTSxHQUFHLElBQUk7RUFDOUMsUUFBUSxHQUFHLFNBQVNBLFFBQU0sUUFBUSxPQUFPLEdBQUcsSUFBSTtDQUNqRDs7O0NDVkEsSUFBSSx5QkFBeUIsTUFBTSwrQkFBK0IsTUFBTTtFQUN2RSxPQUFPLGFBQWEsbUJBQW1CLG9CQUFvQjtFQUMzRCxZQUFZLFFBQVEsUUFBUTtHQUMzQixNQUFNLHVCQUF1QixZQUFZLENBQUMsQ0FBQztHQUMzQyxLQUFLLFNBQVM7R0FDZCxLQUFLLFNBQVM7RUFDZjtDQUNEOzs7OztDQUtBLFNBQVMsbUJBQW1CLFdBQVc7RUFDdEMsT0FBTyxHQUFHLFNBQVMsU0FBUyxHQUFHLFdBQWlDO0NBQ2pFOzs7Q0NkQSxJQUFNLHdCQUF3QixPQUFPLFdBQVcsWUFBWSxxQkFBcUI7Ozs7OztDQU1qRixTQUFTLHNCQUFzQixLQUFLO0VBQ25DLElBQUk7RUFDSixJQUFJLFdBQVc7RUFDZixPQUFPLEVBQUUsTUFBTTtHQUNkLElBQUksVUFBVTtHQUNkLFdBQVc7R0FDWCxVQUFVLElBQUksSUFBSSxTQUFTLElBQUk7R0FDL0IsSUFBSSx1QkFBdUIsV0FBVyxXQUFXLGlCQUFpQixhQUFhLFVBQVU7SUFDeEYsTUFBTSxTQUFTLElBQUksSUFBSSxNQUFNLFlBQVksR0FBRztJQUM1QyxJQUFJLE9BQU8sU0FBUyxRQUFRLE1BQU07SUFDbEMsT0FBTyxjQUFjLElBQUksdUJBQXVCLFFBQVEsT0FBTyxDQUFDO0lBQ2hFLFVBQVU7R0FDWCxHQUFHLEVBQUUsUUFBUSxJQUFJLE9BQU8sQ0FBQztRQUNwQixJQUFJLGtCQUFrQjtJQUMxQixNQUFNLFNBQVMsSUFBSSxJQUFJLFNBQVMsSUFBSTtJQUNwQyxJQUFJLE9BQU8sU0FBUyxRQUFRLE1BQU07S0FDakMsT0FBTyxjQUFjLElBQUksdUJBQXVCLFFBQVEsT0FBTyxDQUFDO0tBQ2hFLFVBQVU7SUFDWDtHQUNELEdBQUcsR0FBRztFQUNQLEVBQUU7Q0FDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0NRQSxJQUFJLHVCQUF1QixNQUFNLHFCQUFxQjtFQUNyRCxPQUFPLDhCQUE4QixtQkFBbUIsNEJBQTRCO0VBQ3BGO0VBQ0E7RUFDQSxrQkFBa0Isc0JBQXNCLElBQUk7RUFDNUMsWUFBWSxtQkFBbUIsU0FBUztHQUN2QyxLQUFLLG9CQUFvQjtHQUN6QixLQUFLLFVBQVU7R0FDZixLQUFLLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztHQUM1QyxLQUFLLGtCQUFrQixJQUFJLGdCQUFnQjtHQUMzQyxLQUFLLGVBQWU7R0FDcEIsS0FBSyxzQkFBc0I7RUFDNUI7RUFDQSxJQUFJLFNBQVM7R0FDWixPQUFPLEtBQUssZ0JBQWdCO0VBQzdCO0VBQ0EsTUFBTSxRQUFRO0dBQ2IsT0FBTyxLQUFLLGdCQUFnQixNQUFNLE1BQU07RUFDekM7RUFDQSxJQUFJLFlBQVk7R0FDZixJQUFJLFFBQVEsU0FBUyxNQUFNLE1BQU0sS0FBSyxrQkFBa0I7R0FDeEQsT0FBTyxLQUFLLE9BQU87RUFDcEI7RUFDQSxJQUFJLFVBQVU7R0FDYixPQUFPLENBQUMsS0FBSztFQUNkOzs7Ozs7Ozs7Ozs7Ozs7RUFlQSxjQUFjLElBQUk7R0FDakIsS0FBSyxPQUFPLGlCQUFpQixTQUFTLEVBQUU7R0FDeEMsYUFBYSxLQUFLLE9BQU8sb0JBQW9CLFNBQVMsRUFBRTtFQUN6RDs7Ozs7Ozs7Ozs7O0VBWUEsUUFBUTtHQUNQLE9BQU8sSUFBSSxjQUFjLENBQUMsQ0FBQztFQUM1Qjs7Ozs7OztFQU9BLFlBQVksU0FBUyxTQUFTO0dBQzdCLE1BQU0sS0FBSyxrQkFBa0I7SUFDNUIsSUFBSSxLQUFLLFNBQVMsUUFBUTtHQUMzQixHQUFHLE9BQU87R0FDVixLQUFLLG9CQUFvQixjQUFjLEVBQUUsQ0FBQztHQUMxQyxPQUFPO0VBQ1I7Ozs7Ozs7RUFPQSxXQUFXLFNBQVMsU0FBUztHQUM1QixNQUFNLEtBQUssaUJBQWlCO0lBQzNCLElBQUksS0FBSyxTQUFTLFFBQVE7R0FDM0IsR0FBRyxPQUFPO0dBQ1YsS0FBSyxvQkFBb0IsYUFBYSxFQUFFLENBQUM7R0FDekMsT0FBTztFQUNSOzs7Ozs7OztFQVFBLHNCQUFzQixVQUFVO0dBQy9CLE1BQU0sS0FBSyx1QkFBdUIsR0FBRyxTQUFTO0lBQzdDLElBQUksS0FBSyxTQUFTLFNBQVMsR0FBRyxJQUFJO0dBQ25DLENBQUM7R0FDRCxLQUFLLG9CQUFvQixxQkFBcUIsRUFBRSxDQUFDO0dBQ2pELE9BQU87RUFDUjs7Ozs7Ozs7RUFRQSxvQkFBb0IsVUFBVSxTQUFTO0dBQ3RDLE1BQU0sS0FBSyxxQkFBcUIsR0FBRyxTQUFTO0lBQzNDLElBQUksQ0FBQyxLQUFLLE9BQU8sU0FBUyxTQUFTLEdBQUcsSUFBSTtHQUMzQyxHQUFHLE9BQU87R0FDVixLQUFLLG9CQUFvQixtQkFBbUIsRUFBRSxDQUFDO0dBQy9DLE9BQU87RUFDUjtFQUNBLGlCQUFpQixRQUFRLE1BQU0sU0FBUyxTQUFTO0dBQ2hELElBQUksU0FBUyxzQkFDUjtRQUFBLEtBQUssU0FBUyxLQUFLLGdCQUFnQixJQUFJO0dBQUE7R0FFNUMsT0FBTyxtQkFBbUIsS0FBSyxXQUFXLE1BQU0sSUFBSSxtQkFBbUIsSUFBSSxJQUFJLE1BQU0sU0FBUztJQUM3RixHQUFHO0lBQ0gsUUFBUSxLQUFLO0dBQ2QsQ0FBQztFQUNGOzs7OztFQUtBLG9CQUFvQjtHQUNuQixLQUFLLE1BQU0sb0NBQW9DO0dBQy9DLFNBQU8sTUFBTSxtQkFBbUIsS0FBSyxrQkFBa0Isc0JBQXNCO0VBQzlFO0VBQ0EsaUJBQWlCO0dBQ2hCLFNBQVMsY0FBYyxJQUFJLFlBQVkscUJBQXFCLDZCQUE2QixFQUFFLFFBQVE7SUFDbEcsbUJBQW1CLEtBQUs7SUFDeEIsV0FBVyxLQUFLO0dBQ2pCLEVBQUUsQ0FBQyxDQUFDO0dBQ0osSUFBSSxDQUFDLEtBQUssU0FBUyw0QkFBNEIsT0FBTyxZQUFZO0lBQ2pFLE1BQU0scUJBQXFCO0lBQzNCLG1CQUFtQixLQUFLO0lBQ3hCLFdBQVcsS0FBSztHQUNqQixHQUFHLEdBQUc7RUFDUDtFQUNBLHlCQUF5QixPQUFPO0dBQy9CLE1BQU0sc0JBQXNCLE1BQU0sUUFBUSxzQkFBc0IsS0FBSztHQUNyRSxNQUFNLGFBQWEsTUFBTSxRQUFRLGNBQWMsS0FBSztHQUNwRCxPQUFPLHVCQUF1QixDQUFDO0VBQ2hDO0VBQ0Esd0JBQXdCO0dBQ3ZCLE1BQU0sTUFBTSxVQUFVO0lBQ3JCLElBQUksRUFBRSxpQkFBaUIsZ0JBQWdCLENBQUMsS0FBSyx5QkFBeUIsS0FBSyxHQUFHO0lBQzlFLEtBQUssa0JBQWtCO0dBQ3hCO0dBQ0EsU0FBUyxpQkFBaUIscUJBQXFCLDZCQUE2QixFQUFFO0dBQzlFLEtBQUssb0JBQW9CLFNBQVMsb0JBQW9CLHFCQUFxQiw2QkFBNkIsRUFBRSxDQUFDO0VBQzVHO0NBQ0QifQ==