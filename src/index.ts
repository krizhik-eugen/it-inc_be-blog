import { app } from "./app";
import { port } from "./configs";

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
