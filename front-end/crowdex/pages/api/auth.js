import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User'
import dbConnect from '../../utils/dbConnect'

const KEY = process.env.APPLICATION_SECRET;

export default async (req, res) => {
  const { email, password } = req.body;

  // TO CREATE NEW USER UNCOMMENT THIS SECTION
  //
  // const ecryptedPass = await bcrypt.hash(password, 9)
  // await User.create({ email: email, password: ecryptedPass });

  /* Any how email or password is blank */
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      error: 'Request missing username or password',
    });
  }
  /* Check user email in database */
  await dbConnect()
  const user = await User.findOne({ email: email });
  /* Check if exists */
  if (!user) {
    /* Send error with message */
    res.status(400).json({ status: 'error', error: 'User Not Found' });
  }
  /* Variables checking */
  if (user) {
    const userEmail = user.email
    const userPassword = user.password
    /* Check and compare password */
    bcrypt.compare(password, userPassword).then(isMatch => {
      /* User matched */
      if (isMatch) {
        /* Create JWT Payload */
        const payload = {
          email: userEmail,
        };
        /* Sign token */
        jwt.sign(
          payload,
          KEY,
          {
            expiresIn: 1800, //30 min
          },
          (err, token) => {
            /* Send succes with token */
            res.status(200).json({
              success: true,
              token: 'Bearer ' + token,
            });
          },
        );
      } else {
        /* Send error with message */
        res
          .status(400)
          .json({ status: 'error', error: 'Password incorrect' });
      }
    });
  }
};