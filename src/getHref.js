// in https://www.youtube.com/channel/xxxxxxxxxxx/videos
// open console run script get urls

var links = document.querySelectorAll('.yt-simple-endpoint');
var urls = [];
for (i = 0; i < links.length; i++) {
	const href = links[i].getAttribute('href');
	if (href !== null && href.includes('/watch?v=')) {
		urls.push(href);
	}
}

var output = '';
for (let i in urls) {
	const x = urls[i];
	output += "'https://www.youtube.com" + x + "',\n";
}

console.log(output);
