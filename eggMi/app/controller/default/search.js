'use strict';

const Controller = require('egg').Controller;
var elasticsearch = require('elasticsearch');
class SearchController extends Controller {
    async index() {
        // this.ctx.body = "search"


        //增加数据
        var result = await this.app.elasticsearch.bulk({
            body: [
                { index: { _index: 'news', _type: 'doc', _id: '12345' } },
                { content: '中国' }
            ]
        });

        this.ctx.body = {
            result: result
        }
    }
}

module.exports = SearchController;
