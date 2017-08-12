/// <reference types="node" />
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBot } from '../lib/interfaces';
export declare class ApiAIBotPlugin implements IBotPlugin {
    protected telegramBotNameAliases: string[];
    protected apiaiClientAccessToken: string;
    name: string;
    description: string;
    protected wordsForSpy: string[];
    protected ai: any;
    constructor(telegramBotNameAliases: string[], apiaiClientAccessToken: string);
    check(bot: IBot, msg: IBotMessage): boolean;
    protected askAi(message: string, sessionId: string): EventEmitter;
    process(bot: IBot, msg: IBotMessage): EventEmitter;
}
