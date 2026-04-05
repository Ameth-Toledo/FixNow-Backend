-- Agregar soporte de respuesta a mensajes (reply)
ALTER TABLE mensajes
  ADD COLUMN id_mensaje_reply INT DEFAULT NULL AFTER archivo_url;

ALTER TABLE mensajes
  ADD CONSTRAINT fk_mensaje_reply
  FOREIGN KEY (id_mensaje_reply) REFERENCES mensajes(id_mensaje) ON DELETE SET NULL;
