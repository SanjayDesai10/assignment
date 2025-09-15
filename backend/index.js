import express from "express"
import authRouter from "./routes/auth.js"
const app = express();
app.use(express.json());

app.use('/api/v1/auth',authRouter);

app.listen(3000,()=>{
	console.log("Server up at port 3000");
});
