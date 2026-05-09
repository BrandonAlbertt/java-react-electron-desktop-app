-- CREATE DATABASE IF NOT EXISTS musicBH;
--USE musicBH;

CREATE TABLE grupos_musicales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagen_url VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    carpeta_slug VARCHAR(255) NULL UNIQUE
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
ALTER TABLE lista_musicales
ADD COLUMN url_imagen VARCHAR(255) NULL AFTER nombre;


CREATE TABLE lista_musica_m (
    lista_id INT NOT NULL,
    musica_id INT NOT NULL,

    PRIMARY KEY (lista_id, musica_id),

    FOREIGN KEY (lista_id)
        REFERENCES lista_musicales(id),

    FOREIGN KEY (musica_id)
        REFERENCES musica(id)
);



INSERT INTO grupos_musicales (imagen_url, nombre) VALUES
('https://ejemplo.com/imagenes/queen.jpg', 'Queen'),
('https://ejemplo.com/imagenes/beatles.jpg', 'The Beatles'),
('https://ejemplo.com/imagenes/ledzeppelin.jpg', 'Led Zeppelin'),
('https://ejemplo.com/imagenes/pinkfloyd.jpg', 'Pink Floyd'),
('https://ejemplo.com/imagenes/nirvana.jpg', 'Nirvana'),
('https://ejemplo.com/imagenes/redhot.jpg', 'Red Hot Chili Peppers'),
('https://ejemplo.com/imagenes/metallica.jpg', 'Metallica'),
('https://ejemplo.com/imagenes/gunsnroses.jpg', 'Guns N'' Roses'),
('https://ejemplo.com/imagenes/coldplay.jpg', 'Coldplay'),
('https://ejemplo.com/imagenes/u2.jpg', 'U2'),
('https://ejemplo.com/imagenes/rollingstones.jpg', 'The Rolling Stones'),
('https://ejemplo.com/imagenes/acdc.jpg', 'AC/DC'),
('https://ejemplo.com/imagenes/bonjovi.jpg', 'Bon Jovi'),
('https://ejemplo.com/imagenes/foofighters.jpg', 'Foo Fighters'),
('https://ejemplo.com/imagenes/radiohead.jpg', 'Radiohead');

INSERT INTO musica (titulo, letra, link_audio, duracion_segundos, grupo_id) VALUES
('Bohemian Rhapsody', 'Is this the real life? Is this just fantasy? Caught in a landslide...', 'https://audio.com/bohemian.mp3', 354, 1),
('Hey Jude', 'Hey Jude, don''t make it bad. Take a sad song and make it better...', 'https://audio.com/heyjude.mp3', 431, 2),
('Stairway to Heaven', 'There''s a lady who''s sure all that glitters is gold...', 'https://audio.com/stairway.mp3', 482, 3),
('Wish You Were Here', 'So, so you think you can tell Heaven from Hell...', 'https://audio.com/wishyou.mp3', 334, 4),
('Smells Like Teen Spirit', 'Load up on guns, bring your friends...', 'https://audio.com/smells.mp3', 302, 5),
('Californication', 'Psychic spies from China try to steal your mind''s elation...', 'https://audio.com/californication.mp3', 325, 6),
('Nothing Else Matters', 'So close, no matter how far...', 'https://audio.com/nothingelse.mp3', 388, 7),
('Sweet Child O'' Mine', 'She''s got a smile that it seems to me...', 'https://audio.com/sweetchild.mp3', 356, 8),
('Yellow', 'Look at the stars, look how they shine for you...', 'https://audio.com/yellow.mp3', 266, 9),
('With or Without You', 'See the stone set in your eyes...', 'https://audio.com/withorwithout.mp3', 297, 10),
('Angie', 'Angie, Angie, when will those clouds all disappear?', 'https://audio.com/angie.mp3', 271, 11),
('Back in Black', 'Back in black, I hit the sack...', 'https://audio.com/backinblack.mp3', 255, 12),
('Livin'' on a Prayer', 'Once upon a time not so long ago...', 'https://audio.com/livinonaprayer.mp3', 249, 13),
('Everlong', 'Hello, I''ve waited here for you...', 'https://audio.com/everlong.mp3', 251, 14),
('Creep', 'When you were here before, couldn''t look you in the eye...', 'https://audio.com/creep.mp3', 235, 15);

INSERT INTO generos_musicales (nombre) VALUES
('Rock'),
('Rock Progresivo'),
('Hard Rock'),
('Heavy Metal'),
('Grunge'),
('Rock Alternativo'),
('Pop Rock'),
('Blues Rock'),
('Britpop'),
('Indie Rock'),
('Punk Rock'),
('Glam Metal'),
('Soft Rock'),
('Funk Rock'),
('Electrónica');

INSERT INTO avatares (imagen_url, nombre) VALUES
('https://ejemplo.com/avatares/avatar1.png', 'Guitarrista'),
('https://ejemplo.com/avatares/avatar2.png', 'Baterista'),
('https://ejemplo.com/avatares/avatar3.png', 'Cantante'),
('https://ejemplo.com/avatares/avatar4.png', 'Bajista'),
('https://ejemplo.com/avatares/avatar5.png', 'Pianista'),
('https://ejemplo.com/avatares/avatar6.png', 'Rockero'),
('https://ejemplo.com/avatares/avatar7.png', 'Metalero'),
('https://ejemplo.com/avatares/avatar8.png', 'Indie'),
('https://ejemplo.com/avatares/avatar9.png', 'Clásico'),
('https://ejemplo.com/avatares/avatar10.png', 'Moderno'),
('https://ejemplo.com/avatares/avatar11.png', 'Jazz'),
('https://ejemplo.com/avatares/avatar12.png', 'Electrónico'),
('https://ejemplo.com/avatares/avatar13.png', 'Folk'),
('https://ejemplo.com/avatares/avatar14.png', 'Country'),
('https://ejemplo.com/avatares/avatar15.png', 'Rapero');

INSERT INTO usuarios (avatar_id, nombre_usuario, email, contrasena) VALUES
(1, 'rockero_1990', 'rockero@email.com', 'hash123456'),
(2, 'metalero77', 'metal@email.com', 'hash789012'),
(3, 'grungefan', 'grunge@email.com', 'hash345678'),
(4, 'poprocker', 'poprock@email.com', 'hash901234'),
(5, 'indie_lover', 'indie@email.com', 'hash567890'),
(6, 'clasicrock', 'classic@email.com', 'hash123789'),
(7, 'punk_rocker', 'punk@email.com', 'hash456012'),
(8, 'bluesman', 'blues@email.com', 'hash789345'),
(9, 'alternativo', 'alternativo@email.com', 'hash012678'),
(10, 'hardrock_fan', 'hardrock@email.com', 'hash345901'),
(11, 'progresivo', 'prog@email.com', 'hash678234'),
(12, 'heavymetal', 'heavymetal@email.com', 'hash901567'),
(13, 'britpop_fan', 'britpop@email.com', 'hash234890'),
(14, 'glam_rocker', 'glam@email.com', 'hash567123'),
(15, 'soft_rock', 'softrock@email.com', 'hash890456');

INSERT INTO lista_musicales (nombre, usuario_id) VALUES
('Mis favoritos del rock', 1),
('Clásicos inolvidables', 2),
('Para entrenar', 3),
('Relajación total', 4),
('Rock de los 80', 5),
('Éxitos del grunge', 6),
('Baladas románticas', 7),
('Rock para la oficina', 8),
('Fiesta rockera', 9),
('Mis imprescindibles', 10),
('Rock progresivo', 11),
('Heavy metal clásico', 12),
('Indie vibes', 13),
('Camino al trabajo', 14),
('Fin de semana', 15);

INSERT INTO musica_generos_m (musica_id, genero_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 7),
(3, 1),
(3, 3),
(4, 1),
(4, 2),
(5, 1),
(5, 5),
(6, 1),
(6, 14),
(7, 4),
(7, 1),
(8, 3),
(8, 1),
(9, 7),
(9, 1),
(10, 1),
(10, 7),
(11, 1),
(11, 13),
(12, 3),
(12, 1),
(13, 12),
(13, 1),
(14, 6),
(14, 1),
(15, 6),
(15, 10);

INSERT INTO lista_musica_m (lista_id, musica_id) VALUES
(1, 1),
(1, 3),
(1, 5),
(1, 7),
(1, 9),
(2, 2),
(2, 4),
(2, 6),
(2, 8),
(2, 10),
(3, 5),
(3, 7),
(3, 8),
(3, 12),
(3, 13),
(4, 4),
(4, 9),
(4, 11),
(4, 15),
(5, 2),
(5, 8),
(5, 11),
(5, 13),
(6, 5),
(6, 6),
(6, 14),
(7, 2),
(7, 9),
(7, 11),
(8, 1),
(8, 4),
(8, 7),
(8, 10),
(8, 14),
(9, 3),
(9, 5),
(9, 7),
(9, 12),
(9, 13),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(10, 5),
(11, 1),
(11, 3),
(11, 4),
(12, 7),
(12, 12),
(12, 13),
(13, 6),
(13, 14),
(13, 15),
(14, 9),
(14, 10),
(14, 11),
(15, 2),
(15, 8),
(15, 15);

SELECT * FROM avatares;



SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE lista_musica_m;
TRUNCATE TABLE musica_generos_m;
TRUNCATE TABLE lista_musicales;
TRUNCATE TABLE musica;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE generos_musicales;
TRUNCATE TABLE grupos_musicales;
TRUNCATE TABLE avatares;
SET FOREIGN_KEY_CHECKS = 1;
