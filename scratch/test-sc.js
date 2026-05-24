const { SoundCloudPlugin } = require('@distube/soundcloud');

async function test() {
    const plugin = new SoundCloudPlugin();
    try {
        console.log('Searching Soundcloud...');
        const results = await plugin.search('Never gonna give you up', { limit: 1 });
        console.log('Found:', results[0].name, results[0].url);
        
        console.log('Resolving stream...');
        const stream = await plugin.getStreamURL(results[0].url);
        console.log('Stream URL:', stream);
        
        if (stream) {
            console.log('Soundcloud extraction works perfectly!');
            process.exit(0);
        } else {
            console.log('Failed to get stream URL.');
            process.exit(1);
        }
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
test();
