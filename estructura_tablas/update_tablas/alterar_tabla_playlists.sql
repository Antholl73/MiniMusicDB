playlist tiene id
tiene foreign key de usuario
un usuario solo tiene una playlist de un nombre
entonces usuario y nombre la identifican
osea la dupla usuario y nombre no se puede repetir

por tanto, drop UNIQUE en nombre
crear primary key compuesta de (usuario, nombre) 
id se mantiene? ya no seria primary key, pero la necesitamos
para evitar cambiar foreign keys en otras tablas por compuestas