const ffmpeg = require('fluent-ffmpeg');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');

let downloadedVideos = [];
let currentIndex = 0;
const videoFolder = './video/';
const screenshotPerSecond = 14;

async function start() {
	downloadedVideos = await fs.promises.readdir(videoFolder);
	qoo();
}

async function qoo() {
	if (downloadedVideos[currentIndex]) {
		const x = downloadedVideos[currentIndex];

		const duration = await getVideoDurationInSeconds(videoFolder + x);

		const count = Math.ceil(duration / screenshotPerSecond);

		const temp = x.split('___');
		const code = temp[0];
		const isDone = temp[1];

		currentIndex++;

		if (isDone != 'done') {
			console.log('index: ' + currentIndex);
			console.log('processing: ' + x);
			await ffmpeg(videoFolder + x)
				.on('end', function () {
					qoo();
					fs.rename(videoFolder + x, videoFolder + temp[0] + '___done___' + temp[1], function () {});
				})
				.on('error', function (err) {
					console.error(err);
				})
				.screenshots({
					count: count,
					filename: code + '___%s.png',
					folder: './output/',
				});
		} else {
			console.log('done screenshot already: ' + x);
			qoo();
		}
	} else {
		console.log('end on index: ' + currentIndex);
	}
}

/*
.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##
......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.
.....##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##..
....##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##...
...##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##....
..##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.....
.##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##......
*/

start();
