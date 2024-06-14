import * as Yup from "yup";
import User from "../models/User";
import jwt from 'jsonwebtoken'
import autoConfig from '../../config/auth'
class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    const userEmailOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: "Make sure your password or email are correct" });
    };

    if (!(await schema.isValid(request.body))) userEmailOrPasswordIncorrect();

    const { email, password } = request.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) userEmailOrPasswordIncorrect();

    if (!(await user.checkPassword(password))) userEmailOrPasswordIncorrect();

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id }, autoConfig.secret, {
        expiresIn: autoConfig.expiresIn,
      })
    });
  }
}

export default new SessionController();
