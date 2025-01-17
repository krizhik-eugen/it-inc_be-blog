import { app } from './initApp';
import { port } from './app/configs/app-config';
import { connectToDB } from './db/db';

app.listen(port, async () => {
    const isConnected = await connectToDB();

    if (!isConnected) {
        console.log('No connection to MongoDB.');
        return process.exit(1);
    }
    console.log(`...server started in port ${port}`);
});
