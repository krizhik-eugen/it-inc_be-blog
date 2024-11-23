import { app } from './app';
import { port } from './configs';
import { connectToDB } from './db';

app.listen(port, async () => {
    const isConnected = await connectToDB();
    if (!isConnected) {
        console.log('MongoDB connection closed.');
        return process.exit(1);
    }
    console.log(`...server started in port ${port}`);
});
