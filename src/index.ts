import { app } from './app';
import { port } from './configs';

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send("Use '/blogs' or '/posts' route to get data");
});
