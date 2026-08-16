var background = (function() {
	//#region node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
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
	//#region shared/domains.ts
	var MULTI_LABEL_TLDS = /* @__PURE__ */ new Set([
		"co.uk",
		"org.uk",
		"ac.uk",
		"gov.uk",
		"com.tr",
		"org.tr",
		"net.tr",
		"edu.tr",
		"com.au",
		"net.au",
		"org.au",
		"co.jp",
		"com.br",
		"co.in",
		"co.nz",
		"com.mx",
		"com.ar",
		"com.sg",
		"co.kr"
	]);
	/**
	* Bir URL'den "kayıt edilebilir alan adı"nı (eTLD+1) çıkarır.
	* Örn. "www.youtube.com/watch?v=1" -> "youtube.com"
	*/
	function registrableDomain(url) {
		try {
			const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
			if (!host) return null;
			const labels = host.split(".");
			if (labels.length <= 1) return host;
			const lastTwo = labels.slice(-2).join(".");
			if (MULTI_LABEL_TLDS.has(lastTwo) && labels.length >= 3) return labels.slice(-3).join(".");
			return lastTwo;
		} catch {
			return null;
		}
	}
	/** Varsayılan konu grupları. Kullanıcı ayarlardan düzenleyebilir. */
	var DEFAULT_TOPIC_GROUPS = {
		Eğlence: [
			"youtube.com",
			"netflix.com",
			"twitch.tv",
			"spotify.com",
			"disneyplus.com"
		],
		Sosyal: [
			"twitter.com",
			"x.com",
			"facebook.com",
			"instagram.com",
			"reddit.com",
			"tiktok.com",
			"linkedin.com"
		],
		Geliştirme: [
			"github.com",
			"stackoverflow.com",
			"gitlab.com",
			"npmjs.com"
		],
		Haber: [
			"cnn.com",
			"bbc.com",
			"reuters.com",
			"nytimes.com",
			"hurriyet.com.tr",
			"sabah.com.tr"
		],
		Alışveriş: [
			"amazon.com",
			"hepsiburada.com",
			"trendyol.com",
			"n11.com",
			"aliexpress.com"
		],
		İş: [
			"notion.so",
			"slack.com",
			"gmail.com",
			"docs.google.com",
			"drive.google.com",
			"asana.com",
			"trello.com"
		]
	};
	/** Bir alan adının hangi konuya ait olduğunu döndürür (yoksa null). */
	function topicForDomain(domain, groups) {
		for (const [topic, domains] of Object.entries(groups)) if (domains.some((d) => domain === d || domain.endsWith("." + d))) return topic;
		return null;
	}
	/** Çalışma modunda varsayılan engellenen siteler (sosyal medya + haber). */
	var DEFAULT_BLOCK_LIST = [
		"facebook.com",
		"twitter.com",
		"x.com",
		"instagram.com",
		"reddit.com",
		"tiktok.com",
		"linkedin.com",
		"youtube.com",
		"twitch.tv",
		"cnn.com",
		"bbc.com",
		"nytimes.com",
		"reuters.com",
		"huffpost.com"
	];
	/** Bir alan adı listedeki herhangi bir alanla eşleşiyor mu? */
	function isBlockedDomain(domain, list) {
		return list.some((d) => domain === d || domain.endsWith("." + d));
	}
	//#endregion
	//#region shared/storage.ts
	var DEFAULT_SETTINGS = {
		topicGroups: DEFAULT_TOPIC_GROUPS,
		sleepTabsEnabled: true,
		sleepAfterMinutes: 15,
		blockList: DEFAULT_BLOCK_LIST,
		workDuration: 25,
		gesturesEnabled: false
	};
	async function getSettings() {
		const stored = (await browser.storage.local.get("settings")).settings;
		return {
			...DEFAULT_SETTINGS,
			...stored,
			topicGroups: {
				...DEFAULT_TOPIC_GROUPS,
				...stored?.topicGroups ?? {}
			}
		};
	}
	async function getSessions() {
		return (await browser.storage.local.get("sessions")).sessions ?? [];
	}
	async function saveSessions(sessions) {
		await browser.storage.local.set({ sessions });
	}
	async function getWorkMode() {
		return (await browser.storage.local.get("workMode")).workMode ?? {
			active: false,
			endsAt: 0
		};
	}
	async function saveWorkMode(state) {
		await browser.storage.local.set({ workMode: state });
	}
	//#endregion
	//#region shared/textrank.ts
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
	//#region entrypoints/background.ts
	var GROUP_COLORS = [
		"grey",
		"blue",
		"red",
		"yellow",
		"green",
		"pink",
		"purple",
		"cyan",
		"orange"
	];
	var LAST_ACTIVE_KEY = "tabLastActive";
	var IDLE_ALARM = "discard-idle";
	var IDLE_CHECK_MINUTES = 1;
	var WORK_MODE_ALARM = "work-mode-end";
	/** Bir anahtardan kararlı bir renk üretir (aynı site her zaman aynı rengi alır). */
	function colorForKey(key) {
		let hash = 0;
		for (let i = 0; i < key.length; i++) hash = hash * 31 + key.charCodeAt(i) >>> 0;
		return GROUP_COLORS[hash % GROUP_COLORS.length];
	}
	var background_default = defineBackground(() => {
		browser.runtime.onInstalled.addListener(() => {
			ensureAlarms();
			ensureWorkModeAlarm();
			browser.contextMenus.removeAll().then(() => {
				browser.contextMenus.create({
					id: "translate-selection",
					title: "Bunu Çevir",
					contexts: ["selection"]
				});
				browser.contextMenus.create({
					id: "summarize-selection",
					title: "Özetle",
					contexts: ["selection"]
				});
				browser.contextMenus.create({
					id: "summarize-page",
					title: "Bu Sayfayı Özetle",
					contexts: ["page"]
				});
				browser.contextMenus.create({
					id: "save-image",
					title: "Görseli Kaydet",
					contexts: ["image"]
				});
			});
		});
		browser.runtime.onStartup.addListener(() => {
			ensureAlarms();
			ensureWorkModeAlarm();
			browser.contextMenus.removeAll().then(() => {
				browser.contextMenus.create({
					id: "translate-selection",
					title: "Bunu Çevir",
					contexts: ["selection"]
				});
				browser.contextMenus.create({
					id: "summarize-selection",
					title: "Özetle",
					contexts: ["selection"]
				});
				browser.contextMenus.create({
					id: "summarize-page",
					title: "Bu Sayfayı Özetle",
					contexts: ["page"]
				});
				browser.contextMenus.create({
					id: "save-image",
					title: "Görseli Kaydet",
					contexts: ["image"]
				});
			});
		});
		browser.contextMenus.onClicked.addListener((info, tab) => {
			if (info.menuItemId === "translate-selection" && info.selectionText) {
				const url = `https://translate.google.com/?sl=auto&tl=tr&text=${encodeURIComponent(info.selectionText)}`;
				browser.tabs.create({ url });
			} else if (info.menuItemId === "summarize-selection" && info.selectionText && tab?.id) {
				const summary = summarize(info.selectionText);
				browser.tabs.sendMessage(tab.id, {
					type: "SHOW_SUMMARY",
					summary
				}).catch((err) => console.error("SHOW_SUMMARY mesajı başarısız:", err));
			} else if (info.menuItemId === "summarize-page" && tab?.id) browser.tabs.sendMessage(tab.id, { type: "SUMMARIZE_PAGE" }).catch((err) => console.error("SUMMARIZE_PAGE mesajı başarısız:", err));
			else if (info.menuItemId === "save-image" && info.srcUrl && tab) browser.downloads.download({
				url: info.srcUrl,
				saveAs: false
			}).catch((err) => console.warn("Görsel indirilemedi:", err));
		});
		browser.alarms.onAlarm.addListener((alarm) => {
			if (alarm.name === IDLE_ALARM) discardIdleTabs().catch((err) => console.warn("Atıl sekme kontrolü:", err));
			else if (alarm.name === WORK_MODE_ALARM) stopWorkMode().catch((err) => console.warn("Çalışma modu bitişi:", err));
		});
		browser.tabs.onActivated.addListener((info) => {
			touchTab(info.tabId);
		});
		browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
			if (changeInfo.status === "complete") touchTab(tabId);
			if (changeInfo.url) maybeBlock(tabId, changeInfo.url);
		});
		browser.webNavigation.onBeforeNavigate.addListener((details) => {
			if (details.frameId === 0 && details.tabId >= 0) maybeBlock(details.tabId, details.url);
		});
		browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
			handleMessage(message, sender.tab?.id).then((res) => sendResponse(res)).catch((err) => sendResponse({
				ok: false,
				error: errMessage(err)
			}));
			return true;
		});
	});
	async function ensureAlarms() {
		if (!await browser.alarms.get(IDLE_ALARM)) await browser.alarms.create(IDLE_ALARM, { periodInMinutes: IDLE_CHECK_MINUTES });
	}
	function errMessage(err) {
		return err instanceof Error ? err.message : String(err);
	}
	async function handleMessage(message, tabId) {
		switch (message.type) {
			case "GROUP_TABS": return {
				ok: true,
				count: await groupTabs(message.mode)
			};
			case "GROUP_SELECTED": return {
				ok: true,
				count: await groupSelected(message.tabIds, message.name)
			};
			case "SAVE_SESSION":
				await saveSession(message.name, message.tabs);
				return { ok: true };
			case "RESTORE_SESSION":
				await restoreSession(message.id);
				return { ok: true };
			case "DELETE_SESSION":
				await deleteSession(message.id);
				return { ok: true };
			case "CLEAR_LAST_HOUR":
				await clearLastHour();
				return { ok: true };
			case "DISCARD_TABS": return {
				ok: true,
				count: await discardTabs(message.tabIds)
			};
			case "START_WORK_MODE":
				await startWorkMode(message.minutes);
				return { ok: true };
			case "STOP_WORK_MODE":
				await stopWorkMode();
				return { ok: true };
			case "GESTURE":
				await handleGesture(message.action, tabId);
				return { ok: true };
			default: return {
				ok: false,
				error: "Bilinmeyen mesaj türü."
			};
		}
	}
	/**
	* Aynı siteye veya konuya ait sekmeleri gruplar.
	* Gruplar pencereye özgüdür; sekmeler `windowId`'ye göre ayrı işlenir.
	*
	* Zaten gruplu sekmelerin `groupId` değerinden mevcut gruplar tespit edilir;
	* böylece ilk gruplamadan sonra açılan yeni sekmeler de (tek olsa bile) mevcut
	* gruba eklenir. Her site/konu, anahtarından üretilen sabit bir renk alır.
	*
	* @returns Oluşturulan/güncellenen grup sayısı.
	*/
	async function groupTabs(mode) {
		if (typeof browser.tabs.group !== "function" || typeof browser.tabGroups?.update !== "function") throw new Error("Bu tarayıcıda sekme gruplama API'si (tabGroups) desteklenmiyor.");
		const settings = await getSettings();
		const allTabs = await browser.tabs.query({});
		const keyForUrl = (url) => {
			const domain = registrableDomain(url);
			if (!domain) return null;
			return mode === "topic" ? topicForDomain(domain, settings.topicGroups) ?? domain : domain;
		};
		const existingGroups = /* @__PURE__ */ new Map();
		for (const tab of allTabs) {
			if (tab.groupId === -1 || tab.windowId == null || !tab.url) continue;
			const key = keyForUrl(tab.url);
			if (!key) continue;
			let byKey = existingGroups.get(tab.windowId);
			if (!byKey) {
				byKey = /* @__PURE__ */ new Map();
				existingGroups.set(tab.windowId, byKey);
			}
			if (!byKey.has(key)) byKey.set(key, tab.groupId);
		}
		const buckets = /* @__PURE__ */ new Map();
		for (const tab of allTabs) {
			if (tab.id == null || !tab.url || tab.windowId == null) continue;
			if (tab.pinned || tab.groupId !== -1) continue;
			if (!tab.url.startsWith("http://") && !tab.url.startsWith("https://")) continue;
			const key = keyForUrl(tab.url);
			if (!key) continue;
			let byKey = buckets.get(tab.windowId);
			if (!byKey) {
				byKey = /* @__PURE__ */ new Map();
				buckets.set(tab.windowId, byKey);
			}
			const ids = byKey.get(key) ?? [];
			ids.push(tab.id);
			byKey.set(key, ids);
		}
		let groupCount = 0;
		for (const [windowId, byKey] of buckets) {
			const existing = existingGroups.get(windowId) ?? /* @__PURE__ */ new Map();
			for (const [title, tabIds] of byKey) {
				const existingGroupId = existing.get(title);
				try {
					if (existingGroupId != null) {
						await browser.tabs.group({
							tabIds,
							groupId: existingGroupId
						});
						groupCount += 1;
					} else if (tabIds.length >= 2) {
						const groupId = await browser.tabs.group({ tabIds });
						await browser.tabGroups.update(groupId, {
							title,
							color: colorForKey(title),
							collapsed: false
						});
						groupCount += 1;
					}
				} catch (err) {
					console.warn(`Gruplama başarısız (${title}):`, err);
				}
			}
		}
		return groupCount;
	}
	/** Kullanıcının seçtiği sekmeleri tek bir grupta toplar. */
	async function groupSelected(tabIds, name) {
		if (typeof browser.tabs.group !== "function" || typeof browser.tabGroups?.update !== "function") throw new Error("Bu tarayıcıda sekme gruplama API'si (tabGroups) desteklenmiyor.");
		if (tabIds.length < 2) throw new Error("Grup için en az 2 sekme seç.");
		const title = name.trim() || "Özel Grup";
		const groupId = await browser.tabs.group({ tabIds });
		await browser.tabGroups.update(groupId, {
			title,
			color: colorForKey(title),
			collapsed: false
		});
		return 1;
	}
	function newId() {
		return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
	}
	async function saveSession(name, tabs) {
		if (tabs.length === 0) throw new Error("Kaydedilecek sekme yok.");
		const session = {
			id: newId(),
			name: name.trim() || "Adsız Oturum",
			createdAt: Date.now(),
			tabs
		};
		const sessions = await getSessions();
		sessions.push(session);
		await saveSessions(sessions);
	}
	async function restoreSession(id) {
		const session = (await getSessions()).find((s) => s.id === id);
		if (!session) throw new Error("Oturum bulunamadı.");
		const urls = session.tabs.map((t) => t.url).filter((u) => u.startsWith("http://") || u.startsWith("https://"));
		if (urls.length === 0) throw new Error("Bu oturumda açılabilir sekme yok.");
		for (const url of urls) await browser.tabs.create({ url });
	}
	async function deleteSession(id) {
		await saveSessions((await getSessions()).filter((s) => s.id !== id));
	}
	async function getLastActive() {
		return (await browser.storage.local.get(LAST_ACTIVE_KEY))[LAST_ACTIVE_KEY] ?? {};
	}
	async function touchTab(tabId) {
		const map = await getLastActive();
		map[tabId] = Date.now();
		await browser.storage.local.set({ [LAST_ACTIVE_KEY]: map });
	}
	/** Kullanıcının seçtiği sekmeleri anında dondurur. */
	async function discardTabs(tabIds) {
		let discarded = 0;
		for (const id of tabIds) try {
			await browser.tabs.discard(id);
			discarded += 1;
		} catch (err) {
			console.warn(`Sekme dondurulamadı (${id}):`, err);
		}
		return discarded;
	}
	/**
	* Belirli süredir dokunulmayan sekmeleri dondurur (RAM'i boşaltır).
	* Aktif, sabitlenmiş, ses çalan ya da zaten dondurulmuş sekmeler atlanır.
	*/
	async function discardIdleTabs() {
		const settings = await getSettings();
		if (!settings.sleepTabsEnabled) return 0;
		const threshold = settings.sleepAfterMinutes * 60 * 1e3;
		const lastActive = await getLastActive();
		const now = Date.now();
		const tabs = await browser.tabs.query({});
		let discarded = 0;
		for (const tab of tabs) {
			if (tab.id == null || !tab.url) continue;
			if (tab.active || tab.pinned || tab.audible || tab.discarded) continue;
			if (!tab.url.startsWith("http://") && !tab.url.startsWith("https://")) continue;
			const last = lastActive[tab.id] ?? tab.lastAccessed;
			if (last == null || now - last < threshold) continue;
			try {
				await browser.tabs.discard(tab.id);
				discarded += 1;
			} catch (err) {
				console.warn(`Sekme dondurulamadı (${tab.id}):`, err);
			}
		}
		return discarded;
	}
	async function handleGesture(action, tabId) {
		if (tabId == null) return;
		try {
			switch (action) {
				case "back":
					await browser.tabs.goBack(tabId);
					break;
				case "forward":
					await browser.tabs.goForward(tabId);
					break;
				case "closeTab":
					await browser.tabs.remove(tabId);
					break;
				case "newTab":
					await browser.tabs.create({});
					break;
				case "reload": await browser.tabs.reload(tabId);
			}
		} catch (err) {
			console.warn("Fare hareketi uygulanamadı:", action, err);
		}
	}
	async function clearLastHour() {
		await browser.browsingData.remove({ since: Date.now() - 36e5 }, {
			cookies: true,
			cache: true,
			cacheStorage: true
		});
	}
	async function startWorkMode(minutes) {
		const endsAt = Date.now() + minutes * 60 * 1e3;
		await saveWorkMode({
			active: true,
			endsAt
		});
		await browser.alarms.create(WORK_MODE_ALARM, { when: endsAt });
	}
	async function stopWorkMode() {
		await saveWorkMode({
			active: false,
			endsAt: 0
		});
		await browser.alarms.clear(WORK_MODE_ALARM);
	}
	async function ensureWorkModeAlarm() {
		const state = await getWorkMode();
		if (!state.active) return;
		if (Date.now() >= state.endsAt) {
			await saveWorkMode({
				active: false,
				endsAt: 0
			});
			return;
		}
		await browser.alarms.create(WORK_MODE_ALARM, { when: state.endsAt });
	}
	async function maybeBlock(tabId, url) {
		const state = await getWorkMode();
		if (!state.active) return;
		if (Date.now() >= state.endsAt) {
			await saveWorkMode({
				active: false,
				endsAt: 0
			});
			return;
		}
		const domain = registrableDomain(url);
		if (!domain) return;
		if (isBlockedDomain(domain, (await getSettings()).blockList)) try {
			await browser.tabs.update(tabId, { url: browser.runtime.getURL("/blocked.html") });
		} catch (err) {
			console.warn("Engelleme yönlendirmesi başarısız:", err);
		}
	}
	//#endregion
	//#region node_modules/@webext-core/match-patterns/dist/index.mjs
	/**
	* Class for parsing and performing operations on match patterns.
	*
	* @example
	*   const pattern = new MatchPattern('*://google.com/*');
	*
	*   pattern.includes('https://google.com'); // true
	*   pattern.includes('http://youtube.com/watch?v=123'); // false
	*/
	var MatchPattern = class MatchPattern {
		static {
			this.PROTOCOLS = [
				"http",
				"https",
				"file",
				"ftp",
				"urn",
				"ws",
				"wss"
			];
		}
		/**
		* Parse a match pattern string. If it is invalid, the constructor will throw an
		* `InvalidMatchPattern` error.
		*
		* @param matchPattern The match pattern to parse.
		*/
		constructor(matchPattern) {
			if (matchPattern === "<all_urls>") {
				this.isAllUrls = true;
				this.protocolMatches = [...MatchPattern.PROTOCOLS];
				this.hostnameMatch = "*";
				this.pathnameMatch = "*";
			} else {
				const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
				if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
				const [_, protocol, hostname, pathname] = groups;
				validateProtocol(matchPattern, protocol);
				validateHostname(matchPattern, hostname);
				this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
				this.hostnameMatch = hostname;
				this.pathnameMatch = pathname;
			}
		}
		/** Check if a URL is included in a pattern. */
		includes(url) {
			const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
			if (this.isAllUrls) return !this.isUnknownProtocol(u);
			return !!this.protocolMatches.find((protocol) => {
				if (protocol === "http") return this.isHttpMatch(u);
				if (protocol === "https") return this.isHttpsMatch(u);
				if (protocol === "file") return this.isFileMatch(u);
				if (protocol === "ftp") return this.isFtpMatch(u);
				if (protocol === "urn") return this.isUrnMatch(u);
			});
		}
		isHttpMatch(url) {
			return url.protocol === "http:" && this.isHostPathMatch(url);
		}
		isHttpsMatch(url) {
			return url.protocol === "https:" && this.isHostPathMatch(url);
		}
		isHostPathMatch(url) {
			if (!this.hostnameMatch || !this.pathnameMatch) return false;
			const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
			const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
			return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
		}
		isUnknownProtocol(url) {
			return !this.protocolMatches.includes(url.protocol.slice(0, -1));
		}
		isPathMatch(url) {
			if (!this.pathnameMatch) return false;
			return this.convertPatternToRegex(this.pathnameMatch).test(url.pathname);
		}
		isFileMatch(url) {
			return url.protocol === "file:" && this.isPathMatch(url);
		}
		isFtpMatch(_url) {
			throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
		}
		isUrnMatch(_url) {
			throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
		}
		convertPatternToRegex(pattern) {
			const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
			return RegExp(`^${starsReplaced}$`);
		}
		escapeForRegex(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
	var InvalidMatchPattern = class extends Error {
		constructor(matchPattern, reason) {
			super(`Invalid match pattern "${matchPattern}": ${reason}`);
		}
	};
	function validateProtocol(matchPattern, protocol) {
		if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
	}
	function validateHostname(matchPattern, hostname) {
		if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
		if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
	}
	//#endregion
	//#region \0virtual:wxt-background-entrypoint?C:/Users/bayra/OneDrive/Desktop/Yapay Zeka Kodlarım/Tarayıcı Uzantısı/entrypoints/background.ts
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
	var ws;
	/** Connect to the websocket and listen for messages. */
	function getDevServerWebSocket() {
		if (ws == null) {
			const serverUrl = "ws://localhost:3001";
			logger.debug("Connecting to dev server @", serverUrl);
			ws = new WebSocket(serverUrl, "vite-hmr");
			ws.addWxtEventListener = ws.addEventListener.bind(ws);
			ws.sendCustom = (event, payload) => ws?.send(JSON.stringify({
				type: "custom",
				event,
				payload
			}));
			ws.addEventListener("open", () => {
				logger.debug("Connected to dev server");
			});
			ws.addEventListener("close", () => {
				logger.debug("Disconnected from dev server");
			});
			ws.addEventListener("error", (event) => {
				logger.error("Failed to connect to dev server", event);
			});
			ws.addEventListener("message", (e) => {
				try {
					const message = JSON.parse(e.data);
					if (message.type === "custom") ws?.dispatchEvent(new CustomEvent(message.event, { detail: message.data }));
				} catch (err) {
					logger.error("Failed to handle message", err);
				}
			});
		}
		return ws;
	}
	/** https://developer.chrome.com/blog/longer-esw-lifetimes/ */
	function keepServiceWorkerAlive() {
		setInterval(async () => {
			await browser.runtime.getPlatformInfo();
		}, 5e3);
	}
	function reloadContentScript(payload) {
		if (browser.runtime.getManifest().manifest_version == 2) reloadContentScriptMv2(payload);
		else reloadContentScriptMv3(payload);
	}
	async function reloadContentScriptMv3({ registration, contentScript }) {
		if (registration === "runtime") await reloadRuntimeContentScriptMv3(contentScript);
		else await reloadManifestContentScriptMv3(contentScript);
	}
	async function reloadManifestContentScriptMv3(contentScript) {
		const id = `wxt:${contentScript.js[0]}`;
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const existing = registered.find((cs) => cs.id === id);
		if (existing) {
			logger.debug("Updating content script", existing);
			await browser.scripting.updateContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		} else {
			logger.debug("Registering new content script...");
			await browser.scripting.registerContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		}
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadRuntimeContentScriptMv3(contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const matches = registered.filter((cs) => {
			const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
			const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
			return hasJs || hasCss;
		});
		if (matches.length === 0) {
			logger.log("Content script is not registered yet, nothing to reload", contentScript);
			return;
		}
		await browser.scripting.updateContentScripts(matches);
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadTabsForContentScript(contentScript) {
		const allTabs = await browser.tabs.query({});
		const matchPatterns = contentScript.matches.map((match) => new MatchPattern(match));
		const matchingTabs = allTabs.filter((tab) => {
			const url = tab.url;
			if (!url) return false;
			return !!matchPatterns.find((pattern) => pattern.includes(url));
		});
		await Promise.all(matchingTabs.map(async (tab) => {
			try {
				await browser.tabs.reload(tab.id);
			} catch (err) {
				logger.warn("Failed to reload tab:", err);
			}
		}));
	}
	async function reloadContentScriptMv2(_payload) {
		throw Error("TODO: reloadContentScriptMv2");
	}
	try {
		const ws = getDevServerWebSocket();
		ws.addWxtEventListener("wxt:reload-extension", () => {
			browser.runtime.reload();
		});
		ws.addWxtEventListener("wxt:reload-content-script", (event) => {
			reloadContentScript(event.detail);
		});
		ws.addEventListener("open", () => ws.sendCustom("wxt:background-initialized"));
		keepServiceWorkerAlive();
	} catch (err) {
		logger.error("Failed to setup web socket connection with dev server", err);
	}
	browser.commands.onCommand.addListener((command) => {
		if (command === "wxt:reload-extension") browser.runtime.reload();
	});
	var result;
	try {
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	//#endregion
	return result;
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiXSwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvZGVmaW5lLWJhY2tncm91bmQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uL3NoYXJlZC9kb21haW5zLnRzIiwiLi4vLi4vc2hhcmVkL3N0b3JhZ2UudHMiLCIuLi8uLi9zaGFyZWQvdGV4dHJhbmsudHMiLCIuLi8uLi9lbnRyeXBvaW50cy9iYWNrZ3JvdW5kLnRzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuXHRpZiAoYXJnID09IG51bGwgfHwgdHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcblx0cmV0dXJuIGFyZztcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsIi8vIEFsYW4gYWTEsSDDp8O2esO8bWxlbWUgdmUga29udSBzZXpnaXNlbGkuXG5cbi8vIEJpcmRlbiBmYXpsYSBldGlrZXRsaSB5YXlnxLFuIMO8bGtlL2FsYW4gYWTEsSB1emFudMSxbGFyxLEuXG5jb25zdCBNVUxUSV9MQUJFTF9UTERTID0gbmV3IFNldChbXG4gICdjby51aycsICdvcmcudWsnLCAnYWMudWsnLCAnZ292LnVrJyxcbiAgJ2NvbS50cicsICdvcmcudHInLCAnbmV0LnRyJywgJ2VkdS50cicsXG4gICdjb20uYXUnLCAnbmV0LmF1JywgJ29yZy5hdScsXG4gICdjby5qcCcsICdjb20uYnInLCAnY28uaW4nLCAnY28ubnonLFxuICAnY29tLm14JywgJ2NvbS5hcicsICdjb20uc2cnLCAnY28ua3InLFxuXSk7XG5cbi8qKlxuICogQmlyIFVSTCdkZW4gXCJrYXnEsXQgZWRpbGViaWxpciBhbGFuIGFkxLFcIm7EsSAoZVRMRCsxKSDDp8Sxa2FyxLFyLlxuICogw5Zybi4gXCJ3d3cueW91dHViZS5jb20vd2F0Y2g/dj0xXCIgLT4gXCJ5b3V0dWJlLmNvbVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RyYWJsZURvbWFpbih1cmw6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICB0cnkge1xuICAgIGNvbnN0IGhvc3QgPSBuZXcgVVJMKHVybCkuaG9zdG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9ed3d3XFwuLywgJycpO1xuICAgIGlmICghaG9zdCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBsYWJlbHMgPSBob3N0LnNwbGl0KCcuJyk7XG4gICAgaWYgKGxhYmVscy5sZW5ndGggPD0gMSkgcmV0dXJuIGhvc3Q7XG5cbiAgICBjb25zdCBsYXN0VHdvID0gbGFiZWxzLnNsaWNlKC0yKS5qb2luKCcuJyk7XG4gICAgaWYgKE1VTFRJX0xBQkVMX1RMRFMuaGFzKGxhc3RUd28pICYmIGxhYmVscy5sZW5ndGggPj0gMykge1xuICAgICAgcmV0dXJuIGxhYmVscy5zbGljZSgtMykuam9pbignLicpO1xuICAgIH1cbiAgICByZXR1cm4gbGFzdFR3bztcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqIFZhcnNhecSxbGFuIGtvbnUgZ3J1cGxhcsSxLiBLdWxsYW7EsWPEsSBheWFybGFyZGFuIGTDvHplbmxleWViaWxpci4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RPUElDX0dST1VQUzogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge1xuICBFxJ9sZW5jZTogWyd5b3V0dWJlLmNvbScsICduZXRmbGl4LmNvbScsICd0d2l0Y2gudHYnLCAnc3BvdGlmeS5jb20nLCAnZGlzbmV5cGx1cy5jb20nXSxcbiAgU29zeWFsOiBbJ3R3aXR0ZXIuY29tJywgJ3guY29tJywgJ2ZhY2Vib29rLmNvbScsICdpbnN0YWdyYW0uY29tJywgJ3JlZGRpdC5jb20nLCAndGlrdG9rLmNvbScsICdsaW5rZWRpbi5jb20nXSxcbiAgR2VsacWfdGlybWU6IFsnZ2l0aHViLmNvbScsICdzdGFja292ZXJmbG93LmNvbScsICdnaXRsYWIuY29tJywgJ25wbWpzLmNvbSddLFxuICBIYWJlcjogWydjbm4uY29tJywgJ2JiYy5jb20nLCAncmV1dGVycy5jb20nLCAnbnl0aW1lcy5jb20nLCAnaHVycml5ZXQuY29tLnRyJywgJ3NhYmFoLmNvbS50ciddLFxuICBBbMSxxZ92ZXJpxZ86IFsnYW1hem9uLmNvbScsICdoZXBzaWJ1cmFkYS5jb20nLCAndHJlbmR5b2wuY29tJywgJ24xMS5jb20nLCAnYWxpZXhwcmVzcy5jb20nXSxcbiAgxLDFnzogWydub3Rpb24uc28nLCAnc2xhY2suY29tJywgJ2dtYWlsLmNvbScsICdkb2NzLmdvb2dsZS5jb20nLCAnZHJpdmUuZ29vZ2xlLmNvbScsICdhc2FuYS5jb20nLCAndHJlbGxvLmNvbSddLFxufTtcblxuLyoqIEJpciBhbGFuIGFkxLFuxLFuIGhhbmdpIGtvbnV5YSBhaXQgb2xkdcSfdW51IGTDtm5kw7xyw7xyICh5b2tzYSBudWxsKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b3BpY0ZvckRvbWFpbihcbiAgZG9tYWluOiBzdHJpbmcsXG4gIGdyb3VwczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+LFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGZvciAoY29uc3QgW3RvcGljLCBkb21haW5zXSBvZiBPYmplY3QuZW50cmllcyhncm91cHMpKSB7XG4gICAgaWYgKGRvbWFpbnMuc29tZSgoZCkgPT4gZG9tYWluID09PSBkIHx8IGRvbWFpbi5lbmRzV2l0aCgnLicgKyBkKSkpIHtcbiAgICAgIHJldHVybiB0b3BpYztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiDDh2FsxLHFn21hIG1vZHVuZGEgdmFyc2F5xLFsYW4gZW5nZWxsZW5lbiBzaXRlbGVyIChzb3N5YWwgbWVkeWEgKyBoYWJlcikuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9CTE9DS19MSVNUID0gW1xuICAnZmFjZWJvb2suY29tJywgJ3R3aXR0ZXIuY29tJywgJ3guY29tJywgJ2luc3RhZ3JhbS5jb20nLCAncmVkZGl0LmNvbScsXG4gICd0aWt0b2suY29tJywgJ2xpbmtlZGluLmNvbScsICd5b3V0dWJlLmNvbScsICd0d2l0Y2gudHYnLFxuICAnY25uLmNvbScsICdiYmMuY29tJywgJ255dGltZXMuY29tJywgJ3JldXRlcnMuY29tJywgJ2h1ZmZwb3N0LmNvbScsXG5dO1xuXG4vKiogQmlyIGFsYW4gYWTEsSBsaXN0ZWRla2kgaGVyaGFuZ2kgYmlyIGFsYW5sYSBlxZ9sZcWfaXlvciBtdT8gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jsb2NrZWREb21haW4oZG9tYWluOiBzdHJpbmcsIGxpc3Q6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIHJldHVybiBsaXN0LnNvbWUoKGQpID0+IGRvbWFpbiA9PT0gZCB8fCBkb21haW4uZW5kc1dpdGgoJy4nICsgZCkpO1xufVxuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbmltcG9ydCB0eXBlIHsgU2Vzc2lvbiwgU2V0dGluZ3MsIFdvcmtNb2RlU3RhdGUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERFRkFVTFRfQkxPQ0tfTElTVCwgREVGQVVMVF9UT1BJQ19HUk9VUFMgfSBmcm9tICcuL2RvbWFpbnMnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogU2V0dGluZ3MgPSB7XG4gIHRvcGljR3JvdXBzOiBERUZBVUxUX1RPUElDX0dST1VQUyxcbiAgc2xlZXBUYWJzRW5hYmxlZDogdHJ1ZSxcbiAgc2xlZXBBZnRlck1pbnV0ZXM6IDE1LFxuICBibG9ja0xpc3Q6IERFRkFVTFRfQkxPQ0tfTElTVCxcbiAgd29ya0R1cmF0aW9uOiAyNSxcbiAgZ2VzdHVyZXNFbmFibGVkOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG4gIGNvbnN0IGRhdGEgPSAoYXdhaXQgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLmdldCgnc2V0dGluZ3MnKSkgYXMge1xuICAgIHNldHRpbmdzPzogUGFydGlhbDxTZXR0aW5ncz47XG4gIH07XG4gIGNvbnN0IHN0b3JlZCA9IGRhdGEuc2V0dGluZ3M7XG4gIHJldHVybiB7XG4gICAgLi4uREVGQVVMVF9TRVRUSU5HUyxcbiAgICAuLi5zdG9yZWQsXG4gICAgdG9waWNHcm91cHM6IHsgLi4uREVGQVVMVF9UT1BJQ19HUk9VUFMsIC4uLihzdG9yZWQ/LnRvcGljR3JvdXBzID8/IHt9KSB9LFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZVNldHRpbmdzKHNldHRpbmdzOiBTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2V0dGluZ3MgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXNzaW9ucygpOiBQcm9taXNlPFNlc3Npb25bXT4ge1xuICBjb25zdCBkYXRhID0gKGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5nZXQoJ3Nlc3Npb25zJykpIGFzIHtcbiAgICBzZXNzaW9ucz86IFNlc3Npb25bXTtcbiAgfTtcbiAgcmV0dXJuIGRhdGEuc2Vzc2lvbnMgPz8gW107XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlU2Vzc2lvbnMoc2Vzc2lvbnM6IFNlc3Npb25bXSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2Vzc2lvbnMgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXb3JrTW9kZSgpOiBQcm9taXNlPFdvcmtNb2RlU3RhdGU+IHtcbiAgY29uc3QgZGF0YSA9IChhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KCd3b3JrTW9kZScpKSBhcyB7XG4gICAgd29ya01vZGU/OiBXb3JrTW9kZVN0YXRlO1xuICB9O1xuICByZXR1cm4gZGF0YS53b3JrTW9kZSA/PyB7IGFjdGl2ZTogZmFsc2UsIGVuZHNBdDogMCB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZVdvcmtNb2RlKHN0YXRlOiBXb3JrTW9kZVN0YXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5zZXQoeyB3b3JrTW9kZTogc3RhdGUgfSk7XG59XG4iLCIvKipcbiAqIFRleHRSYW5rIEFsZ29yaXRtYXPEsSBpbGUgVMO8cmvDp2UgTWV0aW4gw5Z6ZXRsZW1lIE1vZMO8bMO8XG4gKlxuICogTWloYWxjZWEgJiBUYXJhdSAoMjAwNCkgdGFyYWbEsW5kYW4gw7ZuZXJpbGVuIFRleHRSYW5rIGFsZ29yaXRtYXPEsW7EsSBrdWxsYW5hcmFrXG4gKiBtZXRpbiBpw6dlcmlzaW5kZW4gZW4gw7ZuZW1saSBjw7xtbGVsZXJpIMOnxLFrYXLEsXIgKGV4dHJhY3RpdmUgc3VtbWFyaXphdGlvbikuXG4gKi9cblxuLyoqXG4gKiBUw7xya8OnZSBldGtpc2l6IGtlbGltZWxlciAoc3RvcCB3b3JkcykgbGlzdGVzaVxuICovXG5jb25zdCBUVVJLSVNIX1NUT1BfV09SRFMgPSBuZXcgU2V0PHN0cmluZz4oW1xuICAnYmlyJywgJ2J1JywgJ8WfdScsICdvJywgJ3ZlJywgJ2lsZScsICdkZScsICdkYScsICdpw6dpbicsICdnaWJpJywgJ2RhaGEnLCAnw6dvaycsXG4gICdoZXInLCAnbmUnLCAnYW1hJywgJ2FuY2FrJywgJ2tpJywgJ3lhJywgJ2hlbScsICd2ZXlhJywgJ2lzZScsICdiZW4nLCAnc2VuJyxcbiAgJ2JpeicsICdzaXonLCAndmFyJywgJ3lvaycsICdvbGFuJywgJ29sYXJhaycsICdkZW4nLCAnZGFuJywgJ2TEsXInLCAnZGlyJyxcbiAgJ23EsScsICdtaScsICdtdScsICdtw7wnLCAna2FkYXInLCAnc29ucmEnLCAnw7ZuY2UnLCAnYXJhc8SxbmRhJywgJ8O8emVyaW5kZScsXG4gICdhbHTEsW5kYScsICdiZXJpJywgJ2LDtnlsZScsICfFn8O2eWxlJywgJ2hhbmdpJywgJ2tlbmRpJywgJ2F5bsSxJywgJ2RpxJ9lcicsXG4gICdiYXrEsScsICd0w7xtJywgJ2VuJywgJ2hpw6cnXG5dKTtcblxuLyoqXG4gKiBNZXRuaSBjw7xtbGVsZXJlIGF5xLFyxLFyLlxuICogVMO8cmvDp2Ugbm9rdGFsYW1hIGnFn2FyZXRsZXJpbmkgKC4gISA/IOKApikgZGlra2F0ZSBhbMSxci5cbiAqXG4gKiBAcGFyYW0gdGV4dCBBeXLEscWfdMSxcsSxbGFjYWsgbWV0aW5cbiAqIEByZXR1cm5zIEPDvG1sZSBkaXppc2lcbiAqL1xuZnVuY3Rpb24gc3BsaXRJbnRvU2VudGVuY2VzKHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgaWYgKCF0ZXh0IHx8ICF0ZXh0LnRyaW0oKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8vIE5va3RhbGFtYSBpxZ9hcmV0bGVyaW5kZW4gc29ucmEgZ2VsZW4gYm/Fn2x1ayB2ZXlhIHNhdMSxciBzb25sYXLEsW5hIGfDtnJlIGLDtmxcbiAgLy8gLiAhID8g4oCmIGthcmFrdGVybGVyaW5pIGRlc3Rla2xlclxuICBjb25zdCByYXdTZW50ZW5jZXMgPSB0ZXh0XG4gICAgLnNwbGl0KC8oPzw9Wy4hP+KApl0rKVxccysvKVxuICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgIC5maWx0ZXIoKHMpID0+IHMubGVuZ3RoID4gMCk7XG5cbiAgcmV0dXJuIHJhd1NlbnRlbmNlcztcbn1cblxuLyoqXG4gKiBDw7xtbGV5aSBrZWxpbWVsZXJlICh0b2tlbikgYXnEsXLEsXIuXG4gKiBLw7zDp8O8ayBoYXJmZSBkw7Zuw7zFn3TDvHLDvHIgKFTDvHJrw6dlIGthcmFrdGVyIHV5dW1sdSksIG5va3RhbGFtYSBpxZ9hcmV0bGVyaW5pIHRlbWl6bGVyXG4gKiB2ZSBldGtpc2l6IGtlbGltZWxlcmkgKHN0b3Agd29yZHMpIGZpbHRyZWxlci5cbiAqXG4gKiBAcGFyYW0gc2VudGVuY2UgQ8O8bWxlIG1ldG5pXG4gKiBAcmV0dXJucyBGaWx0cmVsZW5tacWfIGtlbGltZSBkaXppc2lcbiAqL1xuZnVuY3Rpb24gdG9rZW5pemUoc2VudGVuY2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIHNlbnRlbmNlXG4gICAgLnRvTG9jYWxlTG93ZXJDYXNlKCd0ci1UUicpXG4gICAgLnJlcGxhY2UoL1teYS16w6fEn8Sxw7bFn8O8MC05XFxzXS9naSwgJyAnKVxuICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgLmZpbHRlcigod29yZCkgPT4gd29yZC5sZW5ndGggPiAwICYmICFUVVJLSVNIX1NUT1BfV09SRFMuaGFzKHdvcmQpKTtcbn1cblxuLyoqXG4gKiDEsGtpIGPDvG1sZSBhcmFzxLFuZGFraSBiZW56ZXJsaWsgc2tvcnVudSBoZXNhcGxhci5cbiAqIEZvcm3DvGw6IE9ydGFrIGV0a2lzaXogb2xtYXlhbiBrZWxpbWUgc2F5xLFzxLEgLyAobG9nKGxlbjEpICsgbG9nKGxlbjIpKVxuICpcbiAqIEBwYXJhbSB3b3JkczEgMS4gY8O8bWxlbmluIGZpbHRyZWxlbm1pxZ8ga2VsaW1lbGVyaVxuICogQHBhcmFtIHdvcmRzMiAyLiBjw7xtbGVuaW4gZmlsdHJlbGVubWnFnyBrZWxpbWVsZXJpXG4gKiBAcmV0dXJucyBCZW56ZXJsaWsgc2tvcnVcbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlU2ltaWxhcml0eSh3b3JkczE6IHN0cmluZ1tdLCB3b3JkczI6IHN0cmluZ1tdKTogbnVtYmVyIHtcbiAgaWYgKHdvcmRzMS5sZW5ndGggPT09IDAgfHwgd29yZHMyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3Qgc2V0MSA9IG5ldyBTZXQod29yZHMxKTtcbiAgY29uc3Qgc2V0MiA9IG5ldyBTZXQod29yZHMyKTtcblxuICAvLyBPcnRhayBrZWxpbWVsZXJpIHNheVxuICBsZXQgc2hhcmVkV29yZHNDb3VudCA9IDA7XG4gIGZvciAoY29uc3Qgd29yZCBvZiBzZXQxKSB7XG4gICAgaWYgKHNldDIuaGFzKHdvcmQpKSB7XG4gICAgICBzaGFyZWRXb3Jkc0NvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNoYXJlZFdvcmRzQ291bnQgPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFBheWRhOiBsb2cobGVuMSkgKyBsb2cobGVuMilcbiAgY29uc3QgZGVub20gPSBNYXRoLmxvZyh3b3JkczEubGVuZ3RoKSArIE1hdGgubG9nKHdvcmRzMi5sZW5ndGgpO1xuXG4gIC8vIFPEsWbEsXJhIHZleWEgbmVnYXRpZiBkZcSfZXJlIGLDtmxtZXlpIGVuZ2VsbGUgKMO2ci4gaGVyIGlraSBjw7xtbGUgZGUgMSBrZWxpbWVsaWtzZSBsb2coMSkrbG9nKDEpPTApXG4gIGlmIChkZW5vbSA8PSAwKSB7XG4gICAgcmV0dXJuIHNoYXJlZFdvcmRzQ291bnQ7XG4gIH1cblxuICByZXR1cm4gc2hhcmVkV29yZHNDb3VudCAvIGRlbm9tO1xufVxuXG4vKipcbiAqIEPDvG1sZWxlciDDvHplcmluZGUgUGFnZVJhbmsgYWxnb3JpdG1hc8SxbsSxIMOnYWzEscWfdMSxcmFyYWsgw7ZuZW0gc2tvcmxhcsSxbsSxIGhlc2FwbGFyLlxuICpcbiAqIEBwYXJhbSBzaW1pbGFyaXR5TWF0cml4IEPDvG1sZWxlciBhcmFzxLEgYmVuemVybGlrIG1hdHJpc2lcbiAqIEBwYXJhbSBkYW1waW5nRmFjdG9yIFPDtm7DvG1sZW1lIGthdHNhecSxc8SxICh2YXJzYXnEsWxhbjogMC44NSlcbiAqIEBwYXJhbSBpdGVyYXRpb25zIMSwdGVyYXN5b24gc2F5xLFzxLEgKHZhcnNhecSxbGFuOiAzMClcbiAqIEByZXR1cm5zIEhlciBjw7xtbGVuaW4gUGFnZVJhbmsgc2tvcnUgZGl6aXNpXG4gKi9cbmZ1bmN0aW9uIHJ1blBhZ2VSYW5rKFxuICBzaW1pbGFyaXR5TWF0cml4OiBudW1iZXJbXVtdLFxuICBkYW1waW5nRmFjdG9yID0gMC44NSxcbiAgaXRlcmF0aW9ucyA9IDMwXG4pOiBudW1iZXJbXSB7XG4gIGNvbnN0IG4gPSBzaW1pbGFyaXR5TWF0cml4Lmxlbmd0aDtcbiAgaWYgKG4gPT09IDApIHJldHVybiBbXTtcblxuICAvLyBCYcWfbGFuZ8Sxw6cgc2tvcmxhcsSxIChoZXIgZMO8xJ/DvG0gacOnaW4gMS4wKVxuICBsZXQgc2NvcmVzID0gbmV3IEFycmF5KG4pLmZpbGwoMS4wKTtcblxuICAvLyBIZXIgY8O8bWxlbmluIHRvcGxhbSBrZW5hciBhxJ/EsXJsxLHEn8SxICjDp8Sxa8SxxZ8gZGVyZWNlc2kpXG4gIGNvbnN0IHdlaWdodFN1bXMgPSBzaW1pbGFyaXR5TWF0cml4Lm1hcCgocm93KSA9PlxuICAgIHJvdy5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwsIDApXG4gICk7XG5cbiAgLy8gUGFnZVJhbmsgaXRlcmFzeW9ubGFyxLFcbiAgZm9yIChsZXQgaXRlciA9IDA7IGl0ZXIgPCBpdGVyYXRpb25zOyBpdGVyKyspIHtcbiAgICBjb25zdCBuZXh0U2NvcmVzID0gbmV3IEFycmF5KG4pLmZpbGwoMSAtIGRhbXBpbmdGYWN0b3IpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuOyBqKyspIHtcbiAgICAgICAgaWYgKGkgIT09IGogJiYgd2VpZ2h0U3Vtc1tqXSA+IDApIHtcbiAgICAgICAgICBzdW0gKz0gKHNpbWlsYXJpdHlNYXRyaXhbal1baV0gLyB3ZWlnaHRTdW1zW2pdKSAqIHNjb3Jlc1tqXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbmV4dFNjb3Jlc1tpXSArPSBkYW1waW5nRmFjdG9yICogc3VtO1xuICAgIH1cblxuICAgIHNjb3JlcyA9IG5leHRTY29yZXM7XG4gIH1cblxuICByZXR1cm4gc2NvcmVzO1xufVxuXG4vKipcbiAqIFZlcmlsZW4gbWV0bmkgVGV4dFJhbmsgYWxnb3JpdG1hc8SxIGt1bGxhbmFyYWsgw7Z6ZXRsZXIuXG4gKlxuICogQHBhcmFtIHRleHQgw5Z6ZXRsZW5lY2VrIFTDvHJrw6dlIG1ldGluXG4gKiBAcGFyYW0gbWF4U2VudGVuY2VzIMSwc3RlbmVuIG1ha3NpbXVtIGPDvG1sZSBzYXnEsXPEsSAoYmVsaXJ0aWxtZXpzZSBvdG9tYXRpayBoZXNhcGxhbsSxcilcbiAqIEByZXR1cm5zIMOWemV0IG1ldGluIChzZcOnaWxlbiBjw7xtbGVsZXIgb3JpamluYWwgc8SxcmFkYSBiaXJsZcWfdGlyaWxtacWfIG9sYXJhaylcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1bW1hcml6ZSh0ZXh0OiBzdHJpbmcsIG1heFNlbnRlbmNlcz86IG51bWJlcik6IHN0cmluZyB7XG4gIC8vIEtlbmFyIGR1cnVtbGFyOiBCb8WfIHZleWEgdGFuxLFtc8SxeiBtZXRpblxuICBpZiAoIXRleHQgfHwgIXRleHQudHJpbSgpKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgY29uc3QgdHJpbW1lZFRleHQgPSB0ZXh0LnRyaW0oKTtcbiAgY29uc3Qgc2VudGVuY2VzID0gc3BsaXRJbnRvU2VudGVuY2VzKHRyaW1tZWRUZXh0KTtcblxuICAvLyBUZWsgY8O8bWxlIHZleWEgYm/FnyBheXLEscWfxLFtIGR1cnVtdVxuICBpZiAoc2VudGVuY2VzLmxlbmd0aCA8PSAxKSB7XG4gICAgcmV0dXJuIHRyaW1tZWRUZXh0O1xuICB9XG5cbiAgLy8gSGVkZWYgY8O8bWxlIHNhecSxc8SxIGJlbGlybGVtZSAodmFyc2F5xLFsYW46IG1heCgyLCBjZWlsKHRvdGFsICogMC4zKSkpXG4gIGNvbnN0IHRhcmdldENvdW50ID1cbiAgICB0eXBlb2YgbWF4U2VudGVuY2VzID09PSAnbnVtYmVyJyAmJiBtYXhTZW50ZW5jZXMgPiAwXG4gICAgICA/IG1heFNlbnRlbmNlc1xuICAgICAgOiBNYXRoLm1heCgyLCBNYXRoLmNlaWwoc2VudGVuY2VzLmxlbmd0aCAqIDAuMykpO1xuXG4gIC8vIE1ldGluZGVraSBjw7xtbGUgc2F5xLFzxLEgaGVkZWYgc2F5xLFkYW4gYXogdmV5YSBlxZ9pdHNlIG1ldG5pIG9sZHXEn3UgZ2liaSBkw7ZuZMO8clxuICBpZiAoc2VudGVuY2VzLmxlbmd0aCA8PSB0YXJnZXRDb3VudCkge1xuICAgIHJldHVybiB0cmltbWVkVGV4dDtcbiAgfVxuXG4gIC8vIDEuIEPDvG1sZWxlcmkgdG9rZW5pemUgZXRcbiAgY29uc3QgdG9rZW5pemVkU2VudGVuY2VzID0gc2VudGVuY2VzLm1hcCgoc2VudGVuY2UpID0+IHRva2VuaXplKHNlbnRlbmNlKSk7XG5cbiAgLy8gMi4gQ8O8bWxlbGVyIGFyYXPEsSBiZW56ZXJsaWsgbWF0cmlzaW5pIG9sdcWfdHVyXG4gIGNvbnN0IG4gPSBzZW50ZW5jZXMubGVuZ3RoO1xuICBjb25zdCBzaW1pbGFyaXR5TWF0cml4OiBudW1iZXJbXVtdID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogbiB9LCAoKSA9PlxuICAgIG5ldyBBcnJheShuKS5maWxsKDApXG4gICk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgIGNvbnN0IHNpbWlsYXJpdHkgPSBjYWxjdWxhdGVTaW1pbGFyaXR5KFxuICAgICAgICB0b2tlbml6ZWRTZW50ZW5jZXNbaV0sXG4gICAgICAgIHRva2VuaXplZFNlbnRlbmNlc1tqXVxuICAgICAgKTtcbiAgICAgIHNpbWlsYXJpdHlNYXRyaXhbaV1bal0gPSBzaW1pbGFyaXR5O1xuICAgICAgc2ltaWxhcml0eU1hdHJpeFtqXVtpXSA9IHNpbWlsYXJpdHk7XG4gICAgfVxuICB9XG5cbiAgLy8gMy4gUGFnZVJhbmsgYWxnb3JpdG1hc8SxIGlsZSBjw7xtbGUgc2tvcmxhcsSxbsSxIGhlc2FwbGFcbiAgY29uc3Qgc2NvcmVzID0gcnVuUGFnZVJhbmsoc2ltaWxhcml0eU1hdHJpeCwgMC44NSwgMzApO1xuXG4gIC8vIDQuIEPDvG1sZWxlcmkgc2tvcmxhcsSxbmEgZ8O2cmUgc8SxcmFsYSB2ZSBlbiB5w7xrc2VrIHNrb3JhIHNhaGlwIGlsayBOIGPDvG1sZXlpIHNlw6dcbiAgY29uc3QgaW5kZXhlZFNlbnRlbmNlcyA9IHNlbnRlbmNlcy5tYXAoKHNlbnRlbmNlLCBpbmRleCkgPT4gKHtcbiAgICBpbmRleCxcbiAgICBzZW50ZW5jZSxcbiAgICBzY29yZTogc2NvcmVzW2luZGV4XSA/PyAwXG4gIH0pKTtcblxuICAvLyBTa29yYSBnw7ZyZSBhemFsYW4gc8SxcmFsYVxuICBpbmRleGVkU2VudGVuY2VzLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcblxuICAvLyBFbiB5w7xrc2VrIHNrb3JsdSBpbGsgdGFyZ2V0Q291bnQgY8O8bWxleWkgYWxcbiAgY29uc3QgdG9wU2VudGVuY2VzID0gaW5kZXhlZFNlbnRlbmNlcy5zbGljZSgwLCB0YXJnZXRDb3VudCk7XG5cbiAgLy8gQ8O8bWxlbGVyaSBvcmlqaW5hbCBtZXRpbmRla2kgc8SxcmFzxLFuYSBnw7ZyZSB0ZWtyYXIgZGl6XG4gIHRvcFNlbnRlbmNlcy5zb3J0KChhLCBiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgLy8gQ8O8bWxlbGVyaSBhcmFsYXLEsW5kYSBib8WfbHVrIGLEsXJha2FyYWsgYmlybGXFn3RpclxuICByZXR1cm4gdG9wU2VudGVuY2VzLm1hcCgoaXRlbSkgPT4gaXRlbS5zZW50ZW5jZSkuam9pbignICcpO1xufVxuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbmltcG9ydCB0eXBlIHsgQmFja2dyb3VuZE1lc3NhZ2UsIE1lc3NhZ2VSZXNwb25zZSB9IGZyb20gJy4uL3NoYXJlZC9tZXNzYWdlcyc7XG5pbXBvcnQge1xuICBnZXRTZXR0aW5ncyxcbiAgZ2V0U2Vzc2lvbnMsXG4gIHNhdmVTZXNzaW9ucyxcbiAgZ2V0V29ya01vZGUsXG4gIHNhdmVXb3JrTW9kZSxcbn0gZnJvbSAnLi4vc2hhcmVkL3N0b3JhZ2UnO1xuaW1wb3J0IHsgcmVnaXN0cmFibGVEb21haW4sIHRvcGljRm9yRG9tYWluLCBpc0Jsb2NrZWREb21haW4gfSBmcm9tICcuLi9zaGFyZWQvZG9tYWlucyc7XG5pbXBvcnQgdHlwZSB7IEdlc3R1cmVBY3Rpb24sIEdyb3VwTW9kZSwgU2Vzc2lvbiwgU2Vzc2lvblRhYiB9IGZyb20gJy4uL3NoYXJlZC90eXBlcyc7XG5pbXBvcnQgeyBzdW1tYXJpemUgfSBmcm9tICcuLi9zaGFyZWQvdGV4dHJhbmsnO1xuXG5jb25zdCBHUk9VUF9DT0xPUlMgPSBbXG4gICdncmV5JywgJ2JsdWUnLCAncmVkJywgJ3llbGxvdycsICdncmVlbicsICdwaW5rJywgJ3B1cnBsZScsICdjeWFuJywgJ29yYW5nZScsXG5dIGFzIGNvbnN0O1xuXG5jb25zdCBMQVNUX0FDVElWRV9LRVkgPSAndGFiTGFzdEFjdGl2ZSc7XG5jb25zdCBJRExFX0FMQVJNID0gJ2Rpc2NhcmQtaWRsZSc7XG5jb25zdCBJRExFX0NIRUNLX01JTlVURVMgPSAxO1xuY29uc3QgV09SS19NT0RFX0FMQVJNID0gJ3dvcmstbW9kZS1lbmQnO1xuXG4vKiogQmlyIGFuYWh0YXJkYW4ga2FyYXJsxLEgYmlyIHJlbmsgw7xyZXRpciAoYXluxLEgc2l0ZSBoZXIgemFtYW4gYXluxLEgcmVuZ2kgYWzEsXIpLiAqL1xuZnVuY3Rpb24gY29sb3JGb3JLZXkoa2V5OiBzdHJpbmcpOiAodHlwZW9mIEdST1VQX0NPTE9SUylbbnVtYmVyXSB7XG4gIGxldCBoYXNoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICBoYXNoID0gKGhhc2ggKiAzMSArIGtleS5jaGFyQ29kZUF0KGkpKSA+Pj4gMDtcbiAgfVxuICByZXR1cm4gR1JPVVBfQ09MT1JTW2hhc2ggJSBHUk9VUF9DT0xPUlMubGVuZ3RoXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7XG4gIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgdm9pZCBlbnN1cmVBbGFybXMoKTtcbiAgICB2b2lkIGVuc3VyZVdvcmtNb2RlQWxhcm0oKTtcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5yZW1vdmVBbGwoKS50aGVuKCgpID0+IHtcbiAgICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAndHJhbnNsYXRlLXNlbGVjdGlvbicsXG4gICAgICAgIHRpdGxlOiAnQnVudSDDh2V2aXInLFxuICAgICAgICBjb250ZXh0czogWydzZWxlY3Rpb24nXSxcbiAgICAgIH0pO1xuICAgICAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdW1tYXJpemUtc2VsZWN0aW9uJyxcbiAgICAgICAgdGl0bGU6ICfDlnpldGxlJyxcbiAgICAgICAgY29udGV4dHM6IFsnc2VsZWN0aW9uJ10sXG4gICAgICB9KTtcbiAgICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VtbWFyaXplLXBhZ2UnLFxuICAgICAgICB0aXRsZTogJ0J1IFNheWZhecSxIMOWemV0bGUnLFxuICAgICAgICBjb250ZXh0czogWydwYWdlJ10sXG4gICAgICB9KTtcbiAgICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc2F2ZS1pbWFnZScsXG4gICAgICAgIHRpdGxlOiAnR8O2cnNlbGkgS2F5ZGV0JyxcbiAgICAgICAgY29udGV4dHM6IFsnaW1hZ2UnXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgYnJvd3Nlci5ydW50aW1lLm9uU3RhcnR1cC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgdm9pZCBlbnN1cmVBbGFybXMoKTtcbiAgICB2b2lkIGVuc3VyZVdvcmtNb2RlQWxhcm0oKTtcbiAgICBicm93c2VyLmNvbnRleHRNZW51cy5yZW1vdmVBbGwoKS50aGVuKCgpID0+IHtcbiAgICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAndHJhbnNsYXRlLXNlbGVjdGlvbicsXG4gICAgICAgIHRpdGxlOiAnQnVudSDDh2V2aXInLFxuICAgICAgICBjb250ZXh0czogWydzZWxlY3Rpb24nXSxcbiAgICAgIH0pO1xuICAgICAgYnJvd3Nlci5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdW1tYXJpemUtc2VsZWN0aW9uJyxcbiAgICAgICAgdGl0bGU6ICfDlnpldGxlJyxcbiAgICAgICAgY29udGV4dHM6IFsnc2VsZWN0aW9uJ10sXG4gICAgICB9KTtcbiAgICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VtbWFyaXplLXBhZ2UnLFxuICAgICAgICB0aXRsZTogJ0J1IFNheWZhecSxIMOWemV0bGUnLFxuICAgICAgICBjb250ZXh0czogWydwYWdlJ10sXG4gICAgICB9KTtcbiAgICAgIGJyb3dzZXIuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc2F2ZS1pbWFnZScsXG4gICAgICAgIHRpdGxlOiAnR8O2cnNlbGkgS2F5ZGV0JyxcbiAgICAgICAgY29udGV4dHM6IFsnaW1hZ2UnXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBicm93c2VyLmNvbnRleHRNZW51cy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKGluZm8sIHRhYikgPT4ge1xuICAgIGlmIChpbmZvLm1lbnVJdGVtSWQgPT09ICd0cmFuc2xhdGUtc2VsZWN0aW9uJyAmJiBpbmZvLnNlbGVjdGlvblRleHQpIHtcbiAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL3RyYW5zbGF0ZS5nb29nbGUuY29tLz9zbD1hdXRvJnRsPXRyJnRleHQ9JHtlbmNvZGVVUklDb21wb25lbnQoaW5mby5zZWxlY3Rpb25UZXh0KX1gO1xuICAgICAgYnJvd3Nlci50YWJzLmNyZWF0ZSh7IHVybCB9KTtcbiAgICB9IGVsc2UgaWYgKGluZm8ubWVudUl0ZW1JZCA9PT0gJ3N1bW1hcml6ZS1zZWxlY3Rpb24nICYmIGluZm8uc2VsZWN0aW9uVGV4dCAmJiB0YWI/LmlkKSB7XG4gICAgICBjb25zdCBzdW1tYXJ5ID0gc3VtbWFyaXplKGluZm8uc2VsZWN0aW9uVGV4dCk7XG4gICAgICBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7IHR5cGU6ICdTSE9XX1NVTU1BUlknLCBzdW1tYXJ5IH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKCdTSE9XX1NVTU1BUlkgbWVzYWrEsSBiYcWfYXLEsXPEsXo6JywgZXJyKSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLm1lbnVJdGVtSWQgPT09ICdzdW1tYXJpemUtcGFnZScgJiYgdGFiPy5pZCkge1xuICAgICAgYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiAnU1VNTUFSSVpFX1BBR0UnIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKCdTVU1NQVJJWkVfUEFHRSBtZXNhasSxIGJhxZ9hcsSxc8SxejonLCBlcnIpKTtcbiAgICB9IGVsc2UgaWYgKGluZm8ubWVudUl0ZW1JZCA9PT0gJ3NhdmUtaW1hZ2UnICYmIGluZm8uc3JjVXJsICYmIHRhYikge1xuICAgICAgYnJvd3Nlci5kb3dubG9hZHMuZG93bmxvYWQoe1xuICAgICAgICB1cmw6IGluZm8uc3JjVXJsLFxuICAgICAgICBzYXZlQXM6IGZhbHNlLFxuICAgICAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS53YXJuKCdHw7Zyc2VsIGluZGlyaWxlbWVkaTonLCBlcnIpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGJyb3dzZXIuYWxhcm1zLm9uQWxhcm0uYWRkTGlzdGVuZXIoKGFsYXJtKSA9PiB7XG4gICAgaWYgKGFsYXJtLm5hbWUgPT09IElETEVfQUxBUk0pIHtcbiAgICAgIGRpc2NhcmRJZGxlVGFicygpLmNhdGNoKChlcnIpID0+IGNvbnNvbGUud2FybignQXTEsWwgc2VrbWUga29udHJvbMO8OicsIGVycikpO1xuICAgIH0gZWxzZSBpZiAoYWxhcm0ubmFtZSA9PT0gV09SS19NT0RFX0FMQVJNKSB7XG4gICAgICBzdG9wV29ya01vZGUoKS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLndhcm4oJ8OHYWzEscWfbWEgbW9kdSBiaXRpxZ9pOicsIGVycikpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gU2VrbWVsZXJlIHNvbiBlcmnFn2ltIHphbWFubGFyxLFuxLEgacWfbGUuXG4gIGJyb3dzZXIudGFicy5vbkFjdGl2YXRlZC5hZGRMaXN0ZW5lcigoaW5mbykgPT4ge1xuICAgIHZvaWQgdG91Y2hUYWIoaW5mby50YWJJZCk7XG4gIH0pO1xuICBicm93c2VyLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgY2hhbmdlSW5mbykgPT4ge1xuICAgIGlmIChjaGFuZ2VJbmZvLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykgdm9pZCB0b3VjaFRhYih0YWJJZCk7XG4gICAgLy8gWWVkZWsgZW5nZWxsZW1lOiB3ZWJOYXZpZ2F0aW9uIGl6bmkgdmVyaWxtZW1pxZ8gb2xzYSBiaWxlIMOnYWzEscWfxLFyLlxuICAgIGlmIChjaGFuZ2VJbmZvLnVybCkgdm9pZCBtYXliZUJsb2NrKHRhYklkLCBjaGFuZ2VJbmZvLnVybCk7XG4gIH0pO1xuXG4gIGJyb3dzZXIud2ViTmF2aWdhdGlvbi5vbkJlZm9yZU5hdmlnYXRlLmFkZExpc3RlbmVyKChkZXRhaWxzKSA9PiB7XG4gICAgaWYgKGRldGFpbHMuZnJhbWVJZCA9PT0gMCAmJiBkZXRhaWxzLnRhYklkID49IDApIHtcbiAgICAgIHZvaWQgbWF5YmVCbG9jayhkZXRhaWxzLnRhYklkLCBkZXRhaWxzLnVybCk7XG4gICAgfVxuICB9KTtcblxuICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuICAgIChtZXNzYWdlOiBCYWNrZ3JvdW5kTWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgIGhhbmRsZU1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLnRhYj8uaWQpXG4gICAgICAgIC50aGVuKChyZXMpID0+IHNlbmRSZXNwb25zZShyZXMpKVxuICAgICAgICAuY2F0Y2goKGVycikgPT4gc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvcjogZXJyTWVzc2FnZShlcnIpIH0pKTtcbiAgICAgIHJldHVybiB0cnVlOyAvLyBhc2Vua3JvbiB5YW7EsXQgacOnaW4gZ2VyZWtsaVxuICAgIH0sXG4gICk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlQWxhcm1zKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGJyb3dzZXIuYWxhcm1zLmdldChJRExFX0FMQVJNKTtcbiAgaWYgKCFleGlzdGluZykge1xuICAgIGF3YWl0IGJyb3dzZXIuYWxhcm1zLmNyZWF0ZShJRExFX0FMQVJNLCB7XG4gICAgICBwZXJpb2RJbk1pbnV0ZXM6IElETEVfQ0hFQ0tfTUlOVVRFUyxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJNZXNzYWdlKGVycjogdW5rbm93bik6IHN0cmluZyB7XG4gIHJldHVybiBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoXG4gIG1lc3NhZ2U6IEJhY2tncm91bmRNZXNzYWdlLFxuICB0YWJJZD86IG51bWJlcixcbik6IFByb21pc2U8TWVzc2FnZVJlc3BvbnNlPiB7XG4gIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgY2FzZSAnR1JPVVBfVEFCUyc6XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgY291bnQ6IGF3YWl0IGdyb3VwVGFicyhtZXNzYWdlLm1vZGUpIH07XG4gICAgY2FzZSAnR1JPVVBfU0VMRUNURUQnOlxuICAgICAgcmV0dXJuIHsgb2s6IHRydWUsIGNvdW50OiBhd2FpdCBncm91cFNlbGVjdGVkKG1lc3NhZ2UudGFiSWRzLCBtZXNzYWdlLm5hbWUpIH07XG4gICAgY2FzZSAnU0FWRV9TRVNTSU9OJzpcbiAgICAgIGF3YWl0IHNhdmVTZXNzaW9uKG1lc3NhZ2UubmFtZSwgbWVzc2FnZS50YWJzKTtcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlIH07XG4gICAgY2FzZSAnUkVTVE9SRV9TRVNTSU9OJzpcbiAgICAgIGF3YWl0IHJlc3RvcmVTZXNzaW9uKG1lc3NhZ2UuaWQpO1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICBjYXNlICdERUxFVEVfU0VTU0lPTic6XG4gICAgICBhd2FpdCBkZWxldGVTZXNzaW9uKG1lc3NhZ2UuaWQpO1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICBjYXNlICdDTEVBUl9MQVNUX0hPVVInOlxuICAgICAgYXdhaXQgY2xlYXJMYXN0SG91cigpO1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICBjYXNlICdESVNDQVJEX1RBQlMnOlxuICAgICAgcmV0dXJuIHsgb2s6IHRydWUsIGNvdW50OiBhd2FpdCBkaXNjYXJkVGFicyhtZXNzYWdlLnRhYklkcykgfTtcbiAgICBjYXNlICdTVEFSVF9XT1JLX01PREUnOlxuICAgICAgYXdhaXQgc3RhcnRXb3JrTW9kZShtZXNzYWdlLm1pbnV0ZXMpO1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICBjYXNlICdTVE9QX1dPUktfTU9ERSc6XG4gICAgICBhd2FpdCBzdG9wV29ya01vZGUoKTtcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlIH07XG4gICAgY2FzZSAnR0VTVFVSRSc6XG4gICAgICBhd2FpdCBoYW5kbGVHZXN0dXJlKG1lc3NhZ2UuYWN0aW9uLCB0YWJJZCk7XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnQmlsaW5tZXllbiBtZXNhaiB0w7xyw7wuJyB9O1xuICB9XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTZWttZSBncnVwbGFtYSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqXG4gKiBBeW7EsSBzaXRleWUgdmV5YSBrb251eWEgYWl0IHNla21lbGVyaSBncnVwbGFyLlxuICogR3J1cGxhciBwZW5jZXJleWUgw7Z6Z8O8ZMO8cjsgc2VrbWVsZXIgYHdpbmRvd0lkYCd5ZSBnw7ZyZSBheXLEsSBpxZ9sZW5pci5cbiAqXG4gKiBaYXRlbiBncnVwbHUgc2VrbWVsZXJpbiBgZ3JvdXBJZGAgZGXEn2VyaW5kZW4gbWV2Y3V0IGdydXBsYXIgdGVzcGl0IGVkaWxpcjtcbiAqIGLDtnlsZWNlIGlsayBncnVwbGFtYWRhbiBzb25yYSBhw6fEsWxhbiB5ZW5pIHNla21lbGVyIGRlICh0ZWsgb2xzYSBiaWxlKSBtZXZjdXRcbiAqIGdydWJhIGVrbGVuaXIuIEhlciBzaXRlL2tvbnUsIGFuYWh0YXLEsW5kYW4gw7xyZXRpbGVuIHNhYml0IGJpciByZW5rIGFsxLFyLlxuICpcbiAqIEByZXR1cm5zIE9sdcWfdHVydWxhbi9nw7xuY2VsbGVuZW4gZ3J1cCBzYXnEsXPEsS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ3JvdXBUYWJzKG1vZGU6IEdyb3VwTW9kZSk6IFByb21pc2U8bnVtYmVyPiB7XG4gIGlmIChcbiAgICB0eXBlb2YgYnJvd3Nlci50YWJzLmdyb3VwICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgdHlwZW9mIGJyb3dzZXIudGFiR3JvdXBzPy51cGRhdGUgIT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1IHRhcmF5xLFjxLFkYSBzZWttZSBncnVwbGFtYSBBUElcXCdzaSAodGFiR3JvdXBzKSBkZXN0ZWtsZW5taXlvci4nLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGdldFNldHRpbmdzKCk7XG4gIGNvbnN0IGFsbFRhYnMgPSBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoe30pO1xuXG4gIGNvbnN0IGtleUZvclVybCA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGRvbWFpbiA9IHJlZ2lzdHJhYmxlRG9tYWluKHVybCk7XG4gICAgaWYgKCFkb21haW4pIHJldHVybiBudWxsO1xuICAgIHJldHVybiBtb2RlID09PSAndG9waWMnXG4gICAgICA/ICh0b3BpY0ZvckRvbWFpbihkb21haW4sIHNldHRpbmdzLnRvcGljR3JvdXBzKSA/PyBkb21haW4pXG4gICAgICA6IGRvbWFpbjtcbiAgfTtcblxuICAvLyBNZXZjdXQgZ3J1cGxhcsSxLCB6YXRlbiBncnVwbHUgc2VrbWVsZXJkZW4gw6fEsWthcjogd2luZG93SWQgLT4gKGFuYWh0YXIgLT4gZ3J1cElkKS5cbiAgY29uc3QgZXhpc3RpbmdHcm91cHMgPSBuZXcgTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4oKTtcbiAgZm9yIChjb25zdCB0YWIgb2YgYWxsVGFicykge1xuICAgIGlmICh0YWIuZ3JvdXBJZCA9PT0gLTEgfHwgdGFiLndpbmRvd0lkID09IG51bGwgfHwgIXRhYi51cmwpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGtleSA9IGtleUZvclVybCh0YWIudXJsKTtcbiAgICBpZiAoIWtleSkgY29udGludWU7XG5cbiAgICBsZXQgYnlLZXkgPSBleGlzdGluZ0dyb3Vwcy5nZXQodGFiLndpbmRvd0lkKTtcbiAgICBpZiAoIWJ5S2V5KSB7XG4gICAgICBieUtleSA9IG5ldyBNYXAoKTtcbiAgICAgIGV4aXN0aW5nR3JvdXBzLnNldCh0YWIud2luZG93SWQsIGJ5S2V5KTtcbiAgICB9XG4gICAgaWYgKCFieUtleS5oYXMoa2V5KSkgYnlLZXkuc2V0KGtleSwgdGFiLmdyb3VwSWQpO1xuICB9XG5cbiAgLy8gR3J1cGxhbm1hbcSxxZ8gc2VrbWVsZXJpIGtvdmFsYTogd2luZG93SWQgLT4gKGFuYWh0YXIgLT4gc2VrbWUgaWQnbGVyaSkuXG4gIGNvbnN0IGJ1Y2tldHMgPSBuZXcgTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyW10+PigpO1xuICBmb3IgKGNvbnN0IHRhYiBvZiBhbGxUYWJzKSB7XG4gICAgaWYgKHRhYi5pZCA9PSBudWxsIHx8ICF0YWIudXJsIHx8IHRhYi53aW5kb3dJZCA9PSBudWxsKSBjb250aW51ZTtcbiAgICBpZiAodGFiLnBpbm5lZCB8fCB0YWIuZ3JvdXBJZCAhPT0gLTEpIGNvbnRpbnVlO1xuICAgIGlmICghdGFiLnVybC5zdGFydHNXaXRoKCdodHRwOi8vJykgJiYgIXRhYi51cmwuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKSkgY29udGludWU7XG5cbiAgICBjb25zdCBrZXkgPSBrZXlGb3JVcmwodGFiLnVybCk7XG4gICAgaWYgKCFrZXkpIGNvbnRpbnVlO1xuXG4gICAgbGV0IGJ5S2V5ID0gYnVja2V0cy5nZXQodGFiLndpbmRvd0lkKTtcbiAgICBpZiAoIWJ5S2V5KSB7XG4gICAgICBieUtleSA9IG5ldyBNYXAoKTtcbiAgICAgIGJ1Y2tldHMuc2V0KHRhYi53aW5kb3dJZCwgYnlLZXkpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkcyA9IGJ5S2V5LmdldChrZXkpID8/IFtdO1xuICAgIGlkcy5wdXNoKHRhYi5pZCk7XG4gICAgYnlLZXkuc2V0KGtleSwgaWRzKTtcbiAgfVxuXG4gIGxldCBncm91cENvdW50ID0gMDtcblxuICBmb3IgKGNvbnN0IFt3aW5kb3dJZCwgYnlLZXldIG9mIGJ1Y2tldHMpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IGV4aXN0aW5nR3JvdXBzLmdldCh3aW5kb3dJZCkgPz8gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcblxuICAgIGZvciAoY29uc3QgW3RpdGxlLCB0YWJJZHNdIG9mIGJ5S2V5KSB7XG4gICAgICBjb25zdCBleGlzdGluZ0dyb3VwSWQgPSBleGlzdGluZy5nZXQodGl0bGUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZXhpc3RpbmdHcm91cElkICE9IG51bGwpIHtcbiAgICAgICAgICBhd2FpdCBicm93c2VyLnRhYnMuZ3JvdXAoeyB0YWJJZHMsIGdyb3VwSWQ6IGV4aXN0aW5nR3JvdXBJZCB9KTtcbiAgICAgICAgICBncm91cENvdW50ICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAodGFiSWRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXBJZCA9IGF3YWl0IGJyb3dzZXIudGFicy5ncm91cCh7IHRhYklkcyB9KTtcbiAgICAgICAgICBhd2FpdCBicm93c2VyLnRhYkdyb3Vwcy51cGRhdGUoZ3JvdXBJZCwge1xuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb2xvcjogY29sb3JGb3JLZXkodGl0bGUpLFxuICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBncm91cENvdW50ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLndhcm4oYEdydXBsYW1hIGJhxZ9hcsSxc8SxeiAoJHt0aXRsZX0pOmAsIGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdyb3VwQ291bnQ7XG59XG5cbi8qKiBLdWxsYW7EsWPEsW7EsW4gc2XDp3RpxJ9pIHNla21lbGVyaSB0ZWsgYmlyIGdydXB0YSB0b3BsYXIuICovXG5hc3luYyBmdW5jdGlvbiBncm91cFNlbGVjdGVkKHRhYklkczogbnVtYmVyW10sIG5hbWU6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gIGlmIChcbiAgICB0eXBlb2YgYnJvd3Nlci50YWJzLmdyb3VwICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgdHlwZW9mIGJyb3dzZXIudGFiR3JvdXBzPy51cGRhdGUgIT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1IHRhcmF5xLFjxLFkYSBzZWttZSBncnVwbGFtYSBBUElcXCdzaSAodGFiR3JvdXBzKSBkZXN0ZWtsZW5taXlvci4nLFxuICAgICk7XG4gIH1cbiAgaWYgKHRhYklkcy5sZW5ndGggPCAyKSB0aHJvdyBuZXcgRXJyb3IoJ0dydXAgacOnaW4gZW4gYXogMiBzZWttZSBzZcOnLicpO1xuXG4gIGNvbnN0IHRpdGxlID0gbmFtZS50cmltKCkgfHwgJ8OWemVsIEdydXAnO1xuICBjb25zdCBncm91cElkID0gYXdhaXQgYnJvd3Nlci50YWJzLmdyb3VwKHsgdGFiSWRzIH0pO1xuICBhd2FpdCBicm93c2VyLnRhYkdyb3Vwcy51cGRhdGUoZ3JvdXBJZCwge1xuICAgIHRpdGxlLFxuICAgIGNvbG9yOiBjb2xvckZvcktleSh0aXRsZSksXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgfSk7XG4gIHJldHVybiAxO1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gT3R1cnVtIHnDtm5ldGljaXNpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5mdW5jdGlvbiBuZXdJZCgpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgMTApfWA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVTZXNzaW9uKG5hbWU6IHN0cmluZywgdGFiczogU2Vzc2lvblRhYltdKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICh0YWJzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdLYXlkZWRpbGVjZWsgc2VrbWUgeW9rLicpO1xuXG4gIGNvbnN0IHNlc3Npb246IFNlc3Npb24gPSB7XG4gICAgaWQ6IG5ld0lkKCksXG4gICAgbmFtZTogbmFtZS50cmltKCkgfHwgJ0Fkc8SxeiBPdHVydW0nLFxuICAgIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICB0YWJzLFxuICB9O1xuXG4gIGNvbnN0IHNlc3Npb25zID0gYXdhaXQgZ2V0U2Vzc2lvbnMoKTtcbiAgc2Vzc2lvbnMucHVzaChzZXNzaW9uKTtcbiAgYXdhaXQgc2F2ZVNlc3Npb25zKHNlc3Npb25zKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVzdG9yZVNlc3Npb24oaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBzZXNzaW9ucyA9IGF3YWl0IGdldFNlc3Npb25zKCk7XG4gIGNvbnN0IHNlc3Npb24gPSBzZXNzaW9ucy5maW5kKChzKSA9PiBzLmlkID09PSBpZCk7XG4gIGlmICghc2Vzc2lvbikgdGhyb3cgbmV3IEVycm9yKCdPdHVydW0gYnVsdW5hbWFkxLEuJyk7XG5cbiAgY29uc3QgdXJscyA9IHNlc3Npb24udGFic1xuICAgIC5tYXAoKHQpID0+IHQudXJsKVxuICAgIC5maWx0ZXIoKHUpID0+IHUuc3RhcnRzV2l0aCgnaHR0cDovLycpIHx8IHUuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKSk7XG5cbiAgaWYgKHVybHMubGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0J1IG90dXJ1bWRhIGHDp8SxbGFiaWxpciBzZWttZSB5b2suJyk7XG5cbiAgLy8gTWV2Y3V0IHBlbmNlcmVkZSB5ZW5pIHNla21lbGVyIG9sYXJhayBhw6cgKGF5csSxIHBlbmNlcmUgZGXEn2lsKS5cbiAgZm9yIChjb25zdCB1cmwgb2YgdXJscykge1xuICAgIGF3YWl0IGJyb3dzZXIudGFicy5jcmVhdGUoeyB1cmwgfSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlU2Vzc2lvbihpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNlc3Npb25zID0gYXdhaXQgZ2V0U2Vzc2lvbnMoKTtcbiAgYXdhaXQgc2F2ZVNlc3Npb25zKHNlc3Npb25zLmZpbHRlcigocykgPT4gcy5pZCAhPT0gaWQpKTtcbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFV5dXlhbiBzZWttZWxlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGFzdEFjdGl2ZSgpOiBQcm9taXNlPFJlY29yZDxudW1iZXIsIG51bWJlcj4+IHtcbiAgY29uc3QgZGF0YSA9IChhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KExBU1RfQUNUSVZFX0tFWSkpIGFzIHtcbiAgICBbTEFTVF9BQ1RJVkVfS0VZXT86IFJlY29yZDxudW1iZXIsIG51bWJlcj47XG4gIH07XG4gIHJldHVybiBkYXRhW0xBU1RfQUNUSVZFX0tFWV0gPz8ge307XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRvdWNoVGFiKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWFwID0gYXdhaXQgZ2V0TGFzdEFjdGl2ZSgpO1xuICBtYXBbdGFiSWRdID0gRGF0ZS5ub3coKTtcbiAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLnNldCh7IFtMQVNUX0FDVElWRV9LRVldOiBtYXAgfSk7XG59XG5cbi8qKiBLdWxsYW7EsWPEsW7EsW4gc2XDp3RpxJ9pIHNla21lbGVyaSBhbsSxbmRhIGRvbmR1cnVyLiAqL1xuYXN5bmMgZnVuY3Rpb24gZGlzY2FyZFRhYnModGFiSWRzOiBudW1iZXJbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gIGxldCBkaXNjYXJkZWQgPSAwO1xuICBmb3IgKGNvbnN0IGlkIG9mIHRhYklkcykge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBicm93c2VyLnRhYnMuZGlzY2FyZChpZCk7XG4gICAgICBkaXNjYXJkZWQgKz0gMTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU2VrbWUgZG9uZHVydWxhbWFkxLEgKCR7aWR9KTpgLCBlcnIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGlzY2FyZGVkO1xufVxuXG4vKipcbiAqIEJlbGlybGkgc8O8cmVkaXIgZG9rdW51bG1heWFuIHNla21lbGVyaSBkb25kdXJ1ciAoUkFNJ2kgYm/Fn2FsdMSxcikuXG4gKiBBa3RpZiwgc2FiaXRsZW5tacWfLCBzZXMgw6dhbGFuIHlhIGRhIHphdGVuIGRvbmR1cnVsbXXFnyBzZWttZWxlciBhdGxhbsSxci5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGlzY2FyZElkbGVUYWJzKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZ2V0U2V0dGluZ3MoKTtcbiAgaWYgKCFzZXR0aW5ncy5zbGVlcFRhYnNFbmFibGVkKSByZXR1cm4gMDtcblxuICBjb25zdCB0aHJlc2hvbGQgPSBzZXR0aW5ncy5zbGVlcEFmdGVyTWludXRlcyAqIDYwICogMTAwMDtcbiAgY29uc3QgbGFzdEFjdGl2ZSA9IGF3YWl0IGdldExhc3RBY3RpdmUoKTtcbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgdGFicyA9IGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7fSk7XG4gIGxldCBkaXNjYXJkZWQgPSAwO1xuXG4gIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICBpZiAodGFiLmlkID09IG51bGwgfHwgIXRhYi51cmwpIGNvbnRpbnVlO1xuICAgIGlmICh0YWIuYWN0aXZlIHx8IHRhYi5waW5uZWQgfHwgdGFiLmF1ZGlibGUgfHwgdGFiLmRpc2NhcmRlZCkgY29udGludWU7XG4gICAgaWYgKCF0YWIudXJsLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSAmJiAhdGFiLnVybC5zdGFydHNXaXRoKCdodHRwczovLycpKSBjb250aW51ZTtcblxuICAgIC8vIMOWbmNlIGtlbmRpIGl6bGVkacSfaW1peiBzb24gZXJpxZ9pbTsgeW9rc2EgdGFyYXnEsWPEsW7EsW4gdmVyZGnEn2kgbGFzdEFjY2Vzc2VkJ8SxXG4gICAgLy8ga3VsbGFuIChrdXJ1bHVtZGFuIGhlbWVuIHNvbnJhIGJpbGUgYXTEsWwgc2VrbWVsZXIgeWFrYWxhbsSxcikuXG4gICAgY29uc3QgbGFzdCA9IGxhc3RBY3RpdmVbdGFiLmlkXSA/PyB0YWIubGFzdEFjY2Vzc2VkO1xuICAgIC8vIEJpbGlubWV5ZW4gc2VrbWVsZXIgXCLFn2ltZGkgZXJpxZ9pbGRpXCIgc2F5xLFsxLFyIChnw7x2ZW5saSB0YXJhZnRhIGthbCkuXG4gICAgaWYgKGxhc3QgPT0gbnVsbCB8fCBub3cgLSBsYXN0IDwgdGhyZXNob2xkKSBjb250aW51ZTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBicm93c2VyLnRhYnMuZGlzY2FyZCh0YWIuaWQpO1xuICAgICAgZGlzY2FyZGVkICs9IDE7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFNla21lIGRvbmR1cnVsYW1hZMSxICgke3RhYi5pZH0pOmAsIGVycik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRpc2NhcmRlZDtcbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZhcmUgaGFyZWtldGxlcmkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdlc3R1cmUoYWN0aW9uOiBHZXN0dXJlQWN0aW9uLCB0YWJJZD86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICBpZiAodGFiSWQgPT0gbnVsbCkgcmV0dXJuO1xuICB0cnkge1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdiYWNrJzpcbiAgICAgICAgYXdhaXQgYnJvd3Nlci50YWJzLmdvQmFjayh0YWJJZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZm9yd2FyZCc6XG4gICAgICAgIGF3YWl0IGJyb3dzZXIudGFicy5nb0ZvcndhcmQodGFiSWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nsb3NlVGFiJzpcbiAgICAgICAgYXdhaXQgYnJvd3Nlci50YWJzLnJlbW92ZSh0YWJJZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbmV3VGFiJzpcbiAgICAgICAgYXdhaXQgYnJvd3Nlci50YWJzLmNyZWF0ZSh7fSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVsb2FkJzpcbiAgICAgICAgYXdhaXQgYnJvd3Nlci50YWJzLnJlbG9hZCh0YWJJZCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS53YXJuKCdGYXJlIGhhcmVrZXRpIHV5Z3VsYW5hbWFkxLE6JywgYWN0aW9uLCBlcnIpO1xuICB9XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBUZWsgdMSxayB0ZW1pemxpayAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJMYXN0SG91cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgYnJvd3Nlci5icm93c2luZ0RhdGEucmVtb3ZlKFxuICAgIHsgc2luY2U6IERhdGUubm93KCkgLSA2MCAqIDYwICogMTAwMCB9LFxuICAgIHsgY29va2llczogdHJ1ZSwgY2FjaGU6IHRydWUsIGNhY2hlU3RvcmFnZTogdHJ1ZSB9LFxuICApO1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRGlra2F0IGthbGthbsSxICjDp2FsxLHFn21hIG1vZHUpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5hc3luYyBmdW5jdGlvbiBzdGFydFdvcmtNb2RlKG1pbnV0ZXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBlbmRzQXQgPSBEYXRlLm5vdygpICsgbWludXRlcyAqIDYwICogMTAwMDtcbiAgYXdhaXQgc2F2ZVdvcmtNb2RlKHsgYWN0aXZlOiB0cnVlLCBlbmRzQXQgfSk7XG4gIGF3YWl0IGJyb3dzZXIuYWxhcm1zLmNyZWF0ZShXT1JLX01PREVfQUxBUk0sIHsgd2hlbjogZW5kc0F0IH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzdG9wV29ya01vZGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IHNhdmVXb3JrTW9kZSh7IGFjdGl2ZTogZmFsc2UsIGVuZHNBdDogMCB9KTtcbiAgYXdhaXQgYnJvd3Nlci5hbGFybXMuY2xlYXIoV09SS19NT0RFX0FMQVJNKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlV29ya01vZGVBbGFybSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc3RhdGUgPSBhd2FpdCBnZXRXb3JrTW9kZSgpO1xuICBpZiAoIXN0YXRlLmFjdGl2ZSkgcmV0dXJuO1xuICBpZiAoRGF0ZS5ub3coKSA+PSBzdGF0ZS5lbmRzQXQpIHtcbiAgICBhd2FpdCBzYXZlV29ya01vZGUoeyBhY3RpdmU6IGZhbHNlLCBlbmRzQXQ6IDAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGF3YWl0IGJyb3dzZXIuYWxhcm1zLmNyZWF0ZShXT1JLX01PREVfQUxBUk0sIHsgd2hlbjogc3RhdGUuZW5kc0F0IH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYXliZUJsb2NrKHRhYklkOiBudW1iZXIsIHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHN0YXRlID0gYXdhaXQgZ2V0V29ya01vZGUoKTtcbiAgaWYgKCFzdGF0ZS5hY3RpdmUpIHJldHVybjtcblxuICBpZiAoRGF0ZS5ub3coKSA+PSBzdGF0ZS5lbmRzQXQpIHtcbiAgICBhd2FpdCBzYXZlV29ya01vZGUoeyBhY3RpdmU6IGZhbHNlLCBlbmRzQXQ6IDAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZG9tYWluID0gcmVnaXN0cmFibGVEb21haW4odXJsKTtcbiAgaWYgKCFkb21haW4pIHJldHVybjtcblxuICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGdldFNldHRpbmdzKCk7XG4gIGlmIChpc0Jsb2NrZWREb21haW4oZG9tYWluLCBzZXR0aW5ncy5ibG9ja0xpc3QpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGJyb3dzZXIudGFicy51cGRhdGUodGFiSWQsIHtcbiAgICAgICAgdXJsOiBicm93c2VyLnJ1bnRpbWUuZ2V0VVJMKCcvYmxvY2tlZC5odG1sJyksXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybignRW5nZWxsZW1lIHnDtm5sZW5kaXJtZXNpIGJhxZ9hcsSxc8SxejonLCBlcnIpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8jcmVnaW9uIHNyYy9pbmRleC50c1xuLyoqXG4qIENsYXNzIGZvciBwYXJzaW5nIGFuZCBwZXJmb3JtaW5nIG9wZXJhdGlvbnMgb24gbWF0Y2ggcGF0dGVybnMuXG4qXG4qIEBleGFtcGxlXG4qICAgY29uc3QgcGF0dGVybiA9IG5ldyBNYXRjaFBhdHRlcm4oJyo6Ly9nb29nbGUuY29tLyonKTtcbipcbiogICBwYXR0ZXJuLmluY2x1ZGVzKCdodHRwczovL2dvb2dsZS5jb20nKTsgLy8gdHJ1ZVxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHA6Ly95b3V0dWJlLmNvbS93YXRjaD92PTEyMycpOyAvLyBmYWxzZVxuKi9cbnZhciBNYXRjaFBhdHRlcm4gPSBjbGFzcyBNYXRjaFBhdHRlcm4ge1xuXHRzdGF0aWMge1xuXHRcdHRoaXMuUFJPVE9DT0xTID0gW1xuXHRcdFx0XCJodHRwXCIsXG5cdFx0XHRcImh0dHBzXCIsXG5cdFx0XHRcImZpbGVcIixcblx0XHRcdFwiZnRwXCIsXG5cdFx0XHRcInVyblwiLFxuXHRcdFx0XCJ3c1wiLFxuXHRcdFx0XCJ3c3NcIlxuXHRcdF07XG5cdH1cblx0LyoqXG5cdCogUGFyc2UgYSBtYXRjaCBwYXR0ZXJuIHN0cmluZy4gSWYgaXQgaXMgaW52YWxpZCwgdGhlIGNvbnN0cnVjdG9yIHdpbGwgdGhyb3cgYW5cblx0KiBgSW52YWxpZE1hdGNoUGF0dGVybmAgZXJyb3IuXG5cdCpcblx0KiBAcGFyYW0gbWF0Y2hQYXR0ZXJuIFRoZSBtYXRjaCBwYXR0ZXJuIHRvIHBhcnNlLlxuXHQqL1xuXHRjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4pIHtcblx0XHRpZiAobWF0Y2hQYXR0ZXJuID09PSBcIjxhbGxfdXJscz5cIikge1xuXHRcdFx0dGhpcy5pc0FsbFVybHMgPSB0cnVlO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBbLi4uTWF0Y2hQYXR0ZXJuLlBST1RPQ09MU107XG5cdFx0XHR0aGlzLmhvc3RuYW1lTWF0Y2ggPSBcIipcIjtcblx0XHRcdHRoaXMucGF0aG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBncm91cHMgPSAvKC4qKTpcXC9cXC8oLio/KShcXC8uKikvLmV4ZWMobWF0Y2hQYXR0ZXJuKTtcblx0XHRcdGlmIChncm91cHMgPT0gbnVsbCkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBcIkluY29ycmVjdCBmb3JtYXRcIik7XG5cdFx0XHRjb25zdCBbXywgcHJvdG9jb2wsIGhvc3RuYW1lLCBwYXRobmFtZV0gPSBncm91cHM7XG5cdFx0XHR2YWxpZGF0ZVByb3RvY29sKG1hdGNoUGF0dGVybiwgcHJvdG9jb2wpO1xuXHRcdFx0dmFsaWRhdGVIb3N0bmFtZShtYXRjaFBhdHRlcm4sIGhvc3RuYW1lKTtcblx0XHRcdHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG5cdFx0fVxuXHR9XG5cdC8qKiBDaGVjayBpZiBhIFVSTCBpcyBpbmNsdWRlZCBpbiBhIHBhdHRlcm4uICovXG5cdGluY2x1ZGVzKHVybCkge1xuXHRcdGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcblx0XHRpZiAodGhpcy5pc0FsbFVybHMpIHJldHVybiAhdGhpcy5pc1Vua25vd25Qcm90b2NvbCh1KTtcblx0XHRyZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImh0dHBcIikgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIikgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImZpbGVcIikgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG5cdFx0fSk7XG5cdH1cblx0aXNIdHRwTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNIdHRwc01hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG5cdFx0aWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGhvc3RuYW1lTWF0Y2hSZWdleHMgPSBbdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSwgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoLnJlcGxhY2UoL15cXCpcXC4vLCBcIlwiKSldO1xuXHRcdGNvbnN0IHBhdGhuYW1lTWF0Y2hSZWdleCA9IHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCk7XG5cdFx0cmV0dXJuICEhaG9zdG5hbWVNYXRjaFJlZ2V4cy5maW5kKChyZWdleCkgPT4gcmVnZXgudGVzdCh1cmwuaG9zdG5hbWUpKSAmJiBwYXRobmFtZU1hdGNoUmVnZXgudGVzdCh1cmwucGF0aG5hbWUpO1xuXHR9XG5cdGlzVW5rbm93blByb3RvY29sKHVybCkge1xuXHRcdHJldHVybiAhdGhpcy5wcm90b2NvbE1hdGNoZXMuaW5jbHVkZXModXJsLnByb3RvY29sLnNsaWNlKDAsIC0xKSk7XG5cdH1cblx0aXNQYXRoTWF0Y2godXJsKSB7XG5cdFx0aWYgKCF0aGlzLnBhdGhuYW1lTWF0Y2gpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKS50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNGaWxlTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJmaWxlOlwiICYmIHRoaXMuaXNQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0Z0cE1hdGNoKF91cmwpIHtcblx0XHR0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcblx0fVxuXHRpc1Vybk1hdGNoKF91cmwpIHtcblx0XHR0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogdXJuOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcblx0fVxuXHRjb252ZXJ0UGF0dGVyblRvUmVnZXgocGF0dGVybikge1xuXHRcdGNvbnN0IHN0YXJzUmVwbGFjZWQgPSB0aGlzLmVzY2FwZUZvclJlZ2V4KHBhdHRlcm4pLnJlcGxhY2UoL1xcXFxcXCovZywgXCIuKlwiKTtcblx0XHRyZXR1cm4gUmVnRXhwKGBeJHtzdGFyc1JlcGxhY2VkfSRgKTtcblx0fVxuXHRlc2NhcGVGb3JSZWdleChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcblx0fVxufTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG5cdFx0c3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcblx0fVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuXHRpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIikgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgJHtwcm90b2NvbH0gbm90IGEgdmFsaWQgcHJvdG9jb2wgKCR7TWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5qb2luKFwiLCBcIil9KWApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVIb3N0bmFtZShtYXRjaFBhdHRlcm4sIGhvc3RuYW1lKSB7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIjpcIikpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYEhvc3RuYW1lIGNhbm5vdCBpbmNsdWRlIGEgcG9ydGApO1xuXHRpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCIqXCIpICYmIGhvc3RuYW1lLmxlbmd0aCA+IDEgJiYgIWhvc3RuYW1lLnN0YXJ0c1dpdGgoXCIqLlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWApO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBJbnZhbGlkTWF0Y2hQYXR0ZXJuLCBNYXRjaFBhdHRlcm4gfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsN10sIm1hcHBpbmdzIjoiOztDQUNBLFNBQVMsaUJBQWlCLEtBQUs7RUFDOUIsSUFBSSxPQUFPLFFBQVEsT0FBTyxRQUFRLFlBQVksT0FBTyxFQUFFLE1BQU0sSUFBSTtFQUNqRSxPQUFPO0NBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7O0NFWUEsSUFBTSxVRGZpQixXQUFXLFNBQVMsU0FBUyxLQUNoRCxXQUFXLFVBQ1gsV0FBVzs7O0NFQWYsSUFBTSxtQ0FBbUIsSUFBSSxJQUFJO0VBQy9CO0VBQVM7RUFBVTtFQUFTO0VBQzVCO0VBQVU7RUFBVTtFQUFVO0VBQzlCO0VBQVU7RUFB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LE9BQUEsYUFBQSxPQUFBLGFBQUE7Q0FDRjtDQUVBLElBQUEscUJBQUEsdUJBQUE7RUFDRSxRQUFBLFFBQUEsWUFBQSxrQkFBQTtHQUNFLGFBQUE7R0FDQSxvQkFBQTtHQUNBLFFBQUEsYUFBQSxVQUFBLENBQUEsQ0FBQSxXQUFBO0lBQ0UsUUFBQSxhQUFBLE9BQUE7S0FDRSxJQUFBO0tBQ0EsT0FBQTtLQUNBLFVBQUEsQ0FBQSxXQUFBO0lBQ0YsQ0FBQTtJQUNBLFFBQUEsYUFBQSxPQUFBO0tBQ0UsSUFBQTtLQUNBLE9BQUE7S0FDQSxVQUFBLENBQUEsV0FBQTtJQUNGLENBQUE7SUFDQSxRQUFBLGFBQUEsT0FBQTtLQUNFLElBQUE7S0FDQSxPQUFBO0tBQ0EsVUFBQSxDQUFBLE1BQUE7SUFDRixDQUFBO0lBQ0EsUUFBQSxhQUFBLE9BQUE7S0FDRSxJQUFBO0tBQ0EsT0FBQTtLQUNBLFVBQUEsQ0FBQSxPQUFBO0lBQ0YsQ0FBQTtHQUNGLENBQUE7RUFDRixDQUFBO0VBQ0EsUUFBQSxRQUFBLFVBQUEsa0JBQUE7R0FDRSxhQUFBO0dBQ0Esb0JBQUE7R0FDQSxRQUFBLGFBQUEsVUFBQSxDQUFBLENBQUEsV0FBQTtJQUNFLFFBQUEsYUFBQSxPQUFBO0tBQ0UsSUFBQTtLQUNBLE9BQUE7S0FDQSxVQUFBLENBQUEsV0FBQTtJQUNGLENBQUE7SUFDQSxRQUFBLGFBQUEsT0FBQTtLQUNFLElBQUE7S0FDQSxPQUFBO0tBQ0EsVUFBQSxDQUFBLFdBQUE7SUFDRixDQUFBO0lBQ0EsUUFBQSxhQUFBLE9BQUE7S0FDRSxJQUFBO0tBQ0EsT0FBQTtLQUNBLFVBQUEsQ0FBQSxNQUFBO0lBQ0YsQ0FBQTtJQUNBLFFBQUEsYUFBQSxPQUFBO0tBQ0UsSUFBQTtLQUNBLE9BQUE7S0FDQSxVQUFBLENBQUEsT0FBQTtJQUNGLENBQUE7R0FDRixDQUFBO0VBQ0YsQ0FBQTtFQUVBLFFBQUEsYUFBQSxVQUFBLGFBQUEsTUFBQSxRQUFBO0dBQ0UsSUFBQSxLQUFBLGVBQUEseUJBQUEsS0FBQSxlQUFBO0lBQ0UsTUFBQSxNQUFBLG9E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LE1BQUEsSUFBQSxHQUFBLEdBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxPQUFBO0VBQ0Y7RUFHQSxNQUFBLDBCQUFBLElBQUEsSUFBQTtFQUNBLEtBQUEsTUFBQSxPQUFBLFNBQUE7R0FDRSxJQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLElBQUEsWUFBQSxNQUFBO0dBQ0EsSUFBQSxJQUFBLFVBQUEsSUFBQSxZQUFBLElBQUE7R0FDQSxJQUFBLENBQUEsSUFBQSxJQUFBLFdBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxJQUFBLFdBQUEsVUFBQSxHQUFBO0dBRUEsTUFBQSxNQUFBLFVBQUEsSUFBQSxHQUFBO0dBQ0EsSUFBQSxDQUFBLEtBQUE7R0FFQSxJQUFBLFFBQUEsUUFBQSxJQUFBLElBQUEsUUFBQTtHQUNBLElBQUEsQ0FBQSxPQUFBO0lBQ0Usd0JBQUEsSUFBQSxJQUFBO0lBQ0EsUUFBQSxJQUFBLElBQUEsVUFBQSxLQUFBO0dBQ0Y7R0FFQSxNQUFBLE1BQUEsTUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBO0dBQ0EsSUFBQSxLQUFBLElBQUEsRUFBQTtHQUNBLE1BQUEsSUFBQSxLQUFBLEdBQUE7RUFDRjtFQUVBLElBQUEsYUFBQTtFQUVBLEtBQUEsTUFBQSxDQUFBLFVBQUEsVUFBQSxTQUFBO0dBQ0UsTUFBQSxXQUFBLGVBQUEsSUFBQSxRQUFBLHFCQUFBLElBQUEsSUFBQTtHQUVBLEtBQUEsTUFBQSxDQUFBLE9BQUEsV0FBQSxPQUFBO0lBQ0UsTUFBQSxrQkFBQSxTQUFBLElBQUEsS0FBQTtJQUVBLElBQUE7S0FDRSxJQUFBLG1CQUFBLE1BQUE7TUFDRSxNQUFBLFFBQUEsS0FBQSxNQUFBO09BQTJCO09BQVEsU0FBQTtNQUF5QixDQUFBO01BQzVELGNBQUE7S0FDRixPQUFBLElBQUEsT0FBQSxVQUFBLEdBQUE7TUFDRSxNQUFBLFVBQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQTtNQUNBLE1BQUEsUUFBQSxVQUFBLE9BQUEsU0FBQTtPQUNFO09BQ0EsT0FBQSxZQUFBLEtBQUE7T0FDQSxXQUFBO01BQ0YsQ0FBQTtNQUNBLGNBQUE7S0FDRjtJQUNGLFNBQUEsS0FBQTtLQUNFLFFBQUEsS0FBQSx1QkFBQSxNQUFBLEtBQUEsR0FBQTtJQUNGO0dBQ0Y7RUFDRjtFQUVBLE9BQUE7Q0FDRjs7Q0FHQSxlQUFBLGNBQUEsUUFBQSxNQUFBO0VBQ0UsSUFBQSxPQUFBLFFBQUEsS0FBQSxVQUFBLGNBQUEsT0FBQSxRQUFBLFdBQUEsV0FBQSxZQUlFLE1BQUEsSUFBQSxNQUFBLGlFQUFBO0VBSUYsSUFBQSxPQUFBLFNBQUEsR0FBQSxNQUFBLElBQUEsTUFBQSw4QkFBQTtFQUVBLE1BQUEsUUFBQSxLQUFBLEtBQUEsS0FBQTtFQUNBLE1BQUEsVUFBQSxNQUFBLFFBQUEsS0FBQSxNQUFBLEVBQUEsT0FBQSxDQUFBO0VBQ0EsTUFBQSxRQUFBLFVBQUEsT0FBQSxTQUFBO0dBQ0U7R0FDQSxPQUFBLFlBQUEsS0FBQTtHQUNBLFdBQUE7RUFDRixDQUFBO0VBQ0EsT0FBQTtDQUNGO0NBSUEsU0FBQSxRQUFBO0VBQ0UsT0FBQSxHQUFBLEtBQUEsSUFBQSxDQUFBLENBQUEsU0FBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLE9BQUEsQ0FBQSxDQUFBLFNBQUEsRUFBQSxDQUFBLENBQUEsTUFBQSxHQUFBLEVBQUE7Q0FDRjtDQUVBLGVBQUEsWUFBQSxNQUFBLE1BQUE7RUFDRSxJQUFBLEtBQUEsV0FBQSxHQUFBLE1BQUEsSUFBQSxNQUFBLHlCQUFBO0VBRUEsTUFBQSxVQUFBO0dBQ0UsSUFBQSxNQUFBO0dBQ0EsTUFBQSxLQUFBLEtBQUEsS0FBQTtHQUNBLFdBQUEsS0FBQSxJQUFBO0dBQ0E7RUFDRjtFQUVBLE1BQUEsV0FBQSxNQUFBLFlBQUE7RUFDQSxTQUFBLEtBQUEsT0FBQTtFQUNBLE1BQUEsYUFBQSxRQUFBO0NBQ0Y7Q0FFQSxlQUFBLGVBQUEsSUFBQTtFQUVFLE1BQUEsV0FBQSxNQURBLFlBQUEsRUFBQSxDQUNBLE1BQUEsTUFBQSxFQUFBLE9BQUEsRUFBQTtFQUNBLElBQUEsQ0FBQSxTQUFBLE1BQUEsSUFBQSxNQUFBLG9CQUFBO0VBRUEsTUFBQSxPQUFBLFFBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLE1BQUEsRUFBQSxXQUFBLFNBQUEsS0FBQSxFQUFBLFdBQUEsVUFBQSxDQUFBO0VBSUEsSUFBQSxLQUFBLFdBQUEsR0FBQSxNQUFBLElBQUEsTUFBQSxtQ0FBQTtFQUdBLEtBQUEsTUFBQSxPQUFBLE1BQ0UsTUFBQSxRQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQTtDQUVKO0NBRUEsZUFBQSxjQUFBLElBQUE7RUFFRSxNQUFBLGNBQUEsTUFEQSxZQUFBLEVBQ0EsQ0FBQSxRQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQTtDQUNGO0NBSUEsZUFBQSxnQkFBQTtFQUlFLFFBQUEsTUFIQSxRQUFBLFFBQUEsTUFBQSxJQUFBLGVBQUEsRUFBQSxDQUdBLG9CQUFBLENBQUE7Q0FDRjtDQUVBLGVBQUEsU0FBQSxPQUFBO0VBQ0UsTUFBQSxNQUFBLE1BQUEsY0FBQTtFQUNBLElBQUEsU0FBQSxLQUFBLElBQUE7RUFDQSxNQUFBLFFBQUEsUUFBQSxNQUFBLElBQUEsR0FBQSxrQkFBQSxJQUFBLENBQUE7Q0FDRjs7Q0FHQSxlQUFBLFlBQUEsUUFBQTtFQUNFLElBQUEsWUFBQTtFQUNBLEtBQUEsTUFBQSxNQUFBLFFBQ0UsSUFBQTtHQUNFLE1BQUEsUUFBQSxLQUFBLFFBQUEsRUFBQTtHQUNBLGFBQUE7RUFDRixTQUFBLEtBQUE7R0FDRSxRQUFBLEtBQUEsd0JBQUEsR0FBQSxLQUFBLEdBQUE7RUFDRjtFQUVGLE9BQUE7Q0FDRjs7Ozs7Q0FNQSxlQUFBLGtCQUFBO0VBQ0UsTUFBQSxXQUFBLE1BQUEsWUFBQTtFQUNBLElBQUEsQ0FBQSxTQUFBLGtCQUFBLE9BQUE7RUFFQSxNQUFBLFlBQUEsU0FBQSxvQkFBQSxLQUFBO0VBQ0EsTUFBQSxhQUFBLE1BQUEsY0FBQTtFQUNBLE1BQUEsTUFBQSxLQUFBLElBQUE7RUFDQSxNQUFBLE9BQUEsTUFBQSxRQUFBLEtBQUEsTUFBQSxDQUFBLENBQUE7RUFDQSxJQUFBLFlBQUE7RUFFQSxLQUFBLE1BQUEsT0FBQSxNQUFBO0dBQ0UsSUFBQSxJQUFBLE1BQUEsUUFBQSxDQUFBLElBQUEsS0FBQTtHQUNBLElBQUEsSUFBQSxVQUFBLElBQUEsVUFBQSxJQUFBLFdBQUEsSUFBQSxXQUFBO0dBQ0EsSUFBQSxDQUFBLElBQUEsSUFBQSxXQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxXQUFBLFVBQUEsR0FBQTtHQUlBLE1BQUEsT0FBQSxXQUFBLElBQUEsT0FBQSxJQUFBO0dBRUEsSUFBQSxRQUFBLFFBQUEsTUFBQSxPQUFBLFdBQUE7R0FFQSxJQUFBO0lBQ0UsTUFBQSxRQUFBLEtBQUEsUUFBQSxJQUFBLEVBQUE7SUFDQSxhQUFBO0dBQ0YsU0FBQSxLQUFBO0lBQ0UsUUFBQSxLQUFBLHdCQUFBLElBQUEsR0FBQSxLQUFBLEdBQUE7R0FDRjtFQUNGO0VBRUEsT0FBQTtDQUNGO0NBSUEsZUFBQSxjQUFBLFFBQUEsT0FBQTtFQUNFLElBQUEsU0FBQSxNQUFBO0VBQ0EsSUFBQTtHQUNFLFFBQUEsUUFBQTtJQUNFLEtBQUE7S0FDRSxNQUFBLFFBQUEsS0FBQSxPQUFBLEtBQUE7S0FDQTtJQUNGLEtBQUE7S0FDRSxNQUFBLFFBQUEsS0FBQSxVQUFBLEtBQUE7S0FDQTtJQUNGLEtBQUE7S0FDRSxNQUFBLFFBQUEsS0FBQSxPQUFBLEtBQUE7S0FDQTtJQUNGLEtBQUE7S0FDRSxNQUFBLFFBQUEsS0FBQSxPQUFBLENBQUEsQ0FBQTtLQUNBO0lBQ0YsS0FBQSxVQUNFLE1BQUEsUUFBQSxLQUFBLE9BQUEsS0FBQTtHQUVKO0VBQ0YsU0FBQSxLQUFBO0dBQ0UsUUFBQSxLQUFBLCtCQUFBLFFBQUEsR0FBQTtFQUNGO0NBQ0Y7Q0FJQSxlQUFBLGdCQUFBO0VBQ0UsTUFBQSxRQUFBLGFBQUEsT0FBQSxFQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxHQUFBO0dBRUksU0FBQTtHQUFlLE9BQUE7R0FBYSxjQUFBO0VBQW1CLENBQUE7Q0FF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