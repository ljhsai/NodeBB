'use strict';

module.exports = function (redisClient, module) {

	module.sortedSetAdd = function (key, score, value, callback) {
		callback = callback || function () {};
		if (Array.isArray(score) && Array.isArray(value)) {
			return sortedSetAddMulti(key, score, value, callback);
		}
		redisClient.zadd(key, score, value, function (err) {
			callback(err);
		});
	};

	function sortedSetAddMulti(key, scores, values, callback) {
		if (!scores.length || !values.length) {
			return callback();
		}

		if (scores.length !== values.length) {
			return callback(new Error('[[error:invalid-data]]'));
		}

		var args = [key];

		for(var i = 0; i < scores.length; ++i) {
			args.push(scores[i], values[i]);
		}

		redisClient.zadd(args, function (err) {
			callback(err);
		});
	}

	module.sortedSetsAdd = function (keys, score, value, callback) {
		callback = callback || function () {};
		var multi = redisClient.multi();

		for(var i = 0; i < keys.length; ++i) {
			multi.zadd(keys[i], score, value);
		}

		multi.exec(function (err) {
			callback(err);
		});
	};


};