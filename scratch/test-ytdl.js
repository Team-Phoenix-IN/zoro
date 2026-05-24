const ytdl = require('@distube/ytdl-core');

async function test() {
    try {
        console.log('Fetching info...');
        const info = await ytdl.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        console.log('Title:', info.videoDetails.title);
        
        console.log('Downloading stream...');
        const stream = ytdl.downloadFromInfo(info, {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        let bytes = 0;
        stream.on('data', chunk => {
            bytes += chunk.length;
            if (bytes > 1024 * 1024) {
                console.log('Successfully streamed 1MB of audio! Playback works.');
                process.exit(0);
            }
        });

        stream.on('error', err => {
            console.error('Stream Error:', err.message);
            process.exit(1);
        });

        setTimeout(() => {
            console.log('Stream timed out. Hung! Total bytes:', bytes);
            process.exit(1);
        }, 10000);

    } catch (err) {
        console.error('Fetch Error:', err.message);
        process.exit(1);
    }
}

test();
