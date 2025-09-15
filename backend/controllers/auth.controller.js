export const signup = async(req,res)=> {
	const {username,email,password} = req.body;
	// check if email exists
	// hash password
	// store in db
	res.status(201).json({
		message : "User created"
	});
};

export const signin = async(req,res)=>{
	const{email,password} = req.body;
	// check if email exists
	// compare password
	// return token
	res.status(200).json({
		message : "User signed in"
	})
}

