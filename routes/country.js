/**
* Copyright © 2015 Uncharted Software Inc.
*
* Property of Uncharted™, formerly Oculus Info Inc.
* http://uncharted.software/
*
* Released under the MIT License.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is furnished to do
* so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

(function() {
    'use strict';

    var express = require('express');
    var router = express.Router();
    var countryDB = require('../db/country');
    var DBUtil = require('../db/db_utils');

    /**
     * GET /country/:countryid
     */
    router.get('/:dateid', function(req, res) {
        // get sql date from id
        var sqlDate = DBUtil.getMySQLDate(req.params.dateid);
        countryDB.getCountryHistogram(
            sqlDate,
            req.query.count, // get count from query param
            function(err,histogram) {
                if (err) {
                    res.status(500).send('Country data could not be retrieved.');
                } else {
                    res.send(histogram);
                }
            });
    });

    module.exports = router;

}());
