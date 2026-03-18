import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storeUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storeUser.password);

    return storeUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storeUser;

    try {
      storeUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "E-mail não confere.",
          action: "Verifique se este dados esta correto.",
        });
      }

      throw error;
    }
    return storeUser;
  }

  async function validatePassword(providedPassword, storePassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storePassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se este dados esta correto.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
