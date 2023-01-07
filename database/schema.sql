CREATE TABLE IF NOT EXISTS user {
  user_id INTEGER(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  cpf VARCHAR(9),
  email VARCHAR(100),
  password VARCHAR(100),
  phone VARCHAR(20),
  PRIMARY KEY user_pk(user_id)
};

CREATE TABLE IF NOT EXISTS specs {
  specs_id INTEGER(11) NOT NULL AUTO_INCREMENT,
  height SMALLINT,
  weight number(5, 2),
  date DATE,
  user_id INTEGER(11),
  PRIMARY KEY specs_id(specs_id),
  FOREIGN KEY user_fk(user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE
};

CREATE TABLE IF NOT EXISTS gym {
  gym_id INTEGER(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(150),
  cnpj VARCHAR(14),
  email VARCHAR(100),
  address VARCHAR(50),
  number VARCHAR(6),
  PRIMARY KEY gym_pk(gym_id)
};

CREATE TABLE IF NOT EXISTS train {
  train_id INTEGER(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(150),
  description VARCHAR(300),
  public BOOLEAN,
  PRIMARY KEY train_id(train_id)
};

CREATE TABLE IF NOT EXISTS stage {
  stage_id INTEGER(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(150),
  description VARCHAR(300),
  train_id INTEGER(11),
  PRIMARY KEY stage_id(stage_id),
  FOREIGN KEY train_fk(train_id) REFERENCES train(train_id) ON UPDATE CASCADE ON DELETE CASCADE
};

CREATE TABLE IF NOT EXISTS exercice {
  exercice_id INTEGER(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(150),
  description VARCHAR(300),
  PRIMARY KEY exercice_id(exercice_id)
};