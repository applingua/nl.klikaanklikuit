'use strict';

const fs = require('fs');

const file = fs.readFileSync('./recording.csv', 'utf8');

const timings = file.match(/\d+.\d+/g)
	.map(Number)
	.map(val => Math.round(val * 1000000))
	.map((val, index, arr) => {
		return arr[index + 1] - val;
	})
	.slice(1, -1);


const parts = timings.reduce((map, timing, index, arr) => {
	map[map.length - 1].push(timing);
	if (timing > 5000 && index < arr.length - 1) {
		map.push([]);
	}
	return map;
}, [[]]);

const types = {
	agc: parts.filter(part => part.length === 56),
	data: parts.filter(part => part.length === 132),
};

function getWords(recordData, sofl, eofl, predictedWords, tolerance) {
	var sof = recordData.map(recordEntry => recordEntry.slice(0, sofl)).reduce((result, recordEntrySof) => recordEntrySof.map((timing, index) => (result[index] || 0) + timing)).map(timing => Math.round(timing / recordData.length));
	console.log(JSON.stringify(sof));
	var eof = eofl === 0 ? [] : recordData.map(recordEntry => recordEntry.slice(-1 * eofl)).reduce((result, recordEntryEof) => recordEntryEof.map((timing, index) => (result[index] || 0) + timing)).map(timing => Math.round(timing / recordData.length));
	console.log(JSON.stringify(eof));

	var words = [].concat.apply([], recordData.map(recordEntry => recordEntry.slice(sofl, -1 * eofl || undefined))).reduce((result, measurement, index, arr) => {
		if (index % predictedWords[0].length === 0) {
			var wordIndex = predictedWords.findIndex(word => word.every((timing, timingIndex) => Math.abs(arr[index + timingIndex] - timing) < tolerance));
			if (wordIndex !== -1) { result[wordIndex].push(arr.slice(index, index + predictedWords[0].length)); }
		}
		return result;
	}, new Array(predictedWords.length).fill(null).map(() => [])).map((word) => word.reduce((result, arr) => arr.map((timing, index) => result[index] + timing), new Array(predictedWords[0].length).fill(0)).map(timing => Math.round(timing / word.length)));
	console.log(JSON.stringify(words));

	var length = (recordData[0].length - sofl - eofl) / words[0].length;

	return {
		sof,
		eof,
		words,
		interval: 10250,
		sensitivity: 0.5,
		repetitions: 4,
		minimalLength: length,
		maximalLength: length,
	};
}

var words = getWords(types.agc, 0, 0, [[264, 283, 233, 1308], [260, 260, 256, 11500]], 200).words;

const agc = [words[0], words[0], words[0], words[0], words[0], words[0], words[0], words[0], words[0], words[0], words[0], words[0], words[0], [words[0][0], words[0][1], words[0][2], words[1][3]]].reduce((arr, sub) => arr.concat(sub), []);

const signal = Object.assign({ agc }, getWords(types.data, 2, 2, [[240, 308, 240, 1348], [240, 1338, 240, 320]], 200));

console.log(JSON.stringify(signal, null, '\t'));
// console.log(parts.map(part => part.length));
