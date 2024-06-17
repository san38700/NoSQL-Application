const NewUser = require('../models/usersignup')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt')

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const User = new NewUser(name, email, hashedPassword)
    User
    .save()
    .then(result => {
      console.log('User Added')
      res.redirect('/admin/products')
    })
    .catch(err => { 
      console.log(err)
    })
};


// exports.createUser = async (req, res) => {
//     try {
//       const { name, email, password } = req.body;
//       const saltRounds = 10
//       const hashedPassword = await bcrypt.hash(password, saltRounds)
//       const newUser = await NewUser.create({ name, email, password : hashedPassword });
//       console.log(newUser)
//       res.status(201).json({ user: newUser });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error or User already exists' });
//     }
//   };

function generateAccessToken(id,name,premiumuser){
  const jwtToken = jwt.sign({userId : id, name : name, ispremiumuser: premiumuser},'9945B89D9F36B59C7C1BB97FF2F51')
  return jwtToken
}

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if the user exists in the database
      const user = await NewUser.findOne({where: {email: email}});
      // console.log(user.email)
      //console.log(user.ispremiumuser)

      if (!user) {
          return res.status(404).json({ message: '404 User not found' });
      }

      //check if password matches after decryption
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: '401 User not authorized' });
      }

      res.json({user:user,jwtToken: generateAccessToken(user.id,user.name,user.ispremiumuser)})

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

