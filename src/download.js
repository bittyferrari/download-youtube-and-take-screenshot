const ytdl = require('ytdl-core');

const videoFolder = './video/';
const fs = require('fs');

let downloadedVideos = [];

let urls = [
	'https://www.youtube.com/watch?v=ncDPcOKBSbw',
	'https://www.youtube.com/watch?v=LtkO2NKo_nU',
	'https://www.youtube.com/watch?v=0P1Im3lIm7A',
];

urls = urls.filter(onlyUnique);

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function start() {
	downloadedVideos = await fs.promises.readdir(videoFolder);
	downloadYoutube();
}

async function downloadYoutube() {
	for (const i in urls) {
		const x = urls[i];

		try {
			const temp = x.split('?v=');
			const code = temp[1];

			let isDownload = false;

			// check is downloaded
			for (const ii in downloadedVideos) {
				const xx = downloadedVideos[ii];

				const temp = xx.split('___');
				if (temp[0] == code) {
					isDownload = true;
					console.log('already downloaded: ' + code);
				}
			}

			if (isDownload === false) {
				console.log('download: ' + code);
				const info = await ytdl.getInfo(x);

				let title = info.videoDetails.title;
				console.log('name: ' + title);

				title = title.replaceAll('|', '');
				title = title.replaceAll('"', '');
				title = title.replaceAll('?', '');
				title = title.replaceAll('/', '');
				title = code + '___' + title;

				/*
				itag container quality codecs                 bitrate  audio bitrate
				18   mp4       360p    avc1.42001E, mp4a.40.2 696.66KB 96KB
				137  mp4       1080p   avc1.640028            4.53MB
				248  webm      1080p   vp9                    2.52MB
				136  mp4       720p    avc1.4d4016            2.2MB
				247  webm      720p    vp9                    1.44MB
				135  mp4       480p    avc1.4d4014            1.1MB
				134  mp4       360p    avc1.4d401e            593.26KB
				140  mp4               mp4a.40.2                       128KB
				*/
				await ytdl(x, { quality: 136 }).pipe(fs.createWriteStream(videoFolder + title + '.mp4'));

				console.log('wait 60 seconds');
				await delay(60000);
			}
		} catch (e) {
			console.log('download failed: ' + e);
		}
	}
}

/*
.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##
......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.
.....##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##..
....##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##...
...##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##....
..##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##.....
.##.......##.......##.......##.......##.......##.......##.......##.......##.......##.......##......
*/

start();
