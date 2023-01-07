'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION processaincreasecounter() RETURNS TRIGGER AS $$
                                      BEGIN
                                        UPDATE "pontuacaoBind" SET "qtAtividadesRealizadas" = "qtAtividadesRealizadas" + 1, "qtHorasRealizadas" = "qtHorasRealizadas" + NEW."horasConsideradas" WHERE "pontuacaoIdPontuacao" = NEW."pontuacaoIdPontuacao" AND "usuarioIdUsuario" = NEW."usuarioIdUsuario";
                                        RETURN NULL;
                                      END
                                      $$ LANGUAGE plpgsql;`)

     await queryInterface.sequelize.query(`CREATE TRIGGER INCREASE_ATIVIDADESREALIZADAS_COUNTER AFTER INSERT ON "registroAtividade" FOR EACH ROW
                                      EXECUTE PROCEDURE processaincreasecounter();`)

     await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION processadecreasecounter() RETURNS TRIGGER AS $$
                                      BEGIN
                                        UPDATE "pontuacaoBind" SET "qtAtividadesRealizadas" = "qtAtividadesRealizadas" - 1, "qtHorasRealizadas" = "qtHorasRealizadas" - OLD."horasConsideradas" WHERE "pontuacaoIdPontuacao" = OLD."pontuacaoIdPontuacao" AND "usuarioIdUsuario" = OLD."usuarioIdUsuario";
                                        RETURN NULL;
                                      END
                                      $$ LANGUAGE plpgsql;`)
     await queryInterface.sequelize.query(`CREATE TRIGGER DECREASE_ATIVIDADESREALIZADAS_COUNTER AFTER DELETE ON "registroAtividade" FOR EACH ROW
                                      EXECUTE PROCEDURE processadecreasecounter();`)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.sequelize.query(`DROP FUNCTION processaincreasecounter() CASCADE;`)

     await queryInterface.sequelize.query(`DROP FUNCTION processadecreasecounter() CASCADE;`)
     
  }
};
