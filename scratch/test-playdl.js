const play = require('play-dl');

async function test() {
    try {
        console.log('Testing play-dl fetch...');
        const stream = await play.stream('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        console.log('Stream successful! Type:', stream.type);
        process.exit(0);
    } catch (err) {
        console.error('play-dl error:', err.message);
        process.exit(1);
    }
}
test();
