import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // o param sequelize é definido ao realizar a conexao com o banco de dados
  // no arquivo /database/index.js
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // esse campo existe apenas no lado do código e nunca na base
        password_hash: Sequelize.STRING,
        provider: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    // criar o relacionamento com o File (por conta do id de arquivo sendo armazenado dentro do usuario)
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    // this faz referencia ao usuario que chama a funcao, e desse jeito nao se utiliza arrow functions
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
