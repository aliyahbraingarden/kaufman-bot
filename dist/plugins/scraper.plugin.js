"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("../lib/utils");
const request = require('request');
const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
class ScraperPlugin {
    constructor(botNameAliases, scraperUri, scraperTimeout, scraperContentSelector, scraperContentLength, scraperSpyWords) {
        this.botNameAliases = botNameAliases;
        this.scraperUri = scraperUri;
        this.scraperTimeout = scraperTimeout;
        this.scraperContentSelector = scraperContentSelector;
        this.scraperContentLength = scraperContentLength;
        this.scraperSpyWords = scraperSpyWords;
        this.name = 'scraper';
        this.description = 'Scraping content segment as jquery selector from remote site';
        this.wordsForSpy = scraperSpyWords;
    }
    check(bot, msg) {
        return (utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
            msg.chat.type === 'private') ||
            (utils_1.checkWordsInMessage(msg.text, this.botNameAliases) &&
                utils_1.checkWordsInMessage(msg.text, this.wordsForSpy) &&
                msg.chat.type !== 'private');
    }
    scrap(text) {
        const event = new events_1.EventEmitter();
        const url = this.scraperUri.replace(new RegExp('{text}', 'ig'), encodeURIComponent(text.trim()));
        request.get(url, { timeout: this.scraperTimeout }, (error, response, body) => {
            if (error) {
                event.emit('message', false, false);
            }
            else {
                const $ = cheerio.load(body);
                const content = $(this.scraperContentSelector).html();
                event.emit('message', htmlToText.fromString(content), url);
            }
        });
        return event;
    }
    process(bot, msg) {
        const event = new events_1.EventEmitter();
        let text = utils_1.removeWordsFromMessage(msg.text, this.wordsForSpy);
        text = utils_1.removeWordsFromMessage(text, this.botNameAliases);
        this.scrap(text).on('message', (answer, url) => {
            if (answer) {
                event.emit('message', answer.substring(0, this.scraperContentLength) + '...\n\n' + url);
            }
            else {
                event.emit('message', false);
            }
        });
        return event;
    }
}
exports.ScraperPlugin = ScraperPlugin;
