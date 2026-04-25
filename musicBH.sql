-- CREATE DATABASE musicBH;

-- USE musicBH;


CREATE TABLE grupos_musicales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagen_url VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE musica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    letra TEXT NOT NULL,
    link_audio VARCHAR(255) NOT NULL,
    duracion_segundos INT NOT NULL,
    grupo_id INT NOT NULL,

    FOREIGN KEY (grupo_id)
        REFERENCES grupos_musicales(id)
);

CREATE TABLE generos_musicales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE musica_generos_m (
    musica_id INT NOT NULL,
    genero_id INT NOT NULL,

    PRIMARY KEY (musica_id, genero_id),

    FOREIGN KEY (musica_id)
        REFERENCES musica(id),

    FOREIGN KEY (genero_id)
        REFERENCES generos_musicales(id)
);

CREATE TABLE avatares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagen_url VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    avatar_id INT NOT NULL,
    nombre_usuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,

    FOREIGN KEY (avatar_id)
        REFERENCES avatares(id)
);

CREATE TABLE lista_musicales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    usuario_id INT NOT NULL,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);

CREATE TABLE lista_musica_m (
    lista_id INT NOT NULL,
    musica_id INT NOT NULL,

    PRIMARY KEY (lista_id, musica_id),

    FOREIGN KEY (lista_id)
        REFERENCES lista_musicales(id),

    FOREIGN KEY (musica_id)
        REFERENCES musica(id)
);



