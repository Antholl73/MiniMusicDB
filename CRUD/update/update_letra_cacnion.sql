-- 1. Homura (id=1)
UPDATE canciones SET letra_cacnion = '{
  "es": "La llama que arde en mi corazón nunca se apagará",
  "en": "The flame that burns inside my heart will never fade away",
  "ja": "心の中で燃える炎は決して消えない"
}'::jsonb WHERE id = 1;

-- 2. Thriller (id=2)
UPDATE canciones SET letra_cacnion = '{
  "es": "Es el thriller, la noche de los muertos vivientes bailando",
  "en": "It is the thriller, night of the undead dancing in darkness",
  "ja": "スリラー、死者たちが夜に踊り狂う恐怖の夜"
}'::jsonb WHERE id = 2;

-- 3. Master of Puppets (id=3)
UPDATE canciones SET letra_cacnion = '{
  "es": "Soy el maestro, controlo tus hilos y tu mente",
  "en": "I am the master pulling all your strings controlling you always",
  "ja": "俺がマスターだ、お前の糸を引いて支配する"
}'::jsonb WHERE id = 3;

-- 4. Levitating (id=4)
UPDATE canciones SET letra_cacnion = '{
  "es": "Estoy levitando contigo entre las estrellas brillantes del cielo",
  "en": "I am levitating with you among the shining stars above tonight",
  "ja": "あなたと一緒に輝く星々の間を浮かびながら飛んでいる"
}'::jsonb WHERE id = 4;

-- 5. Sonne (id=5)
UPDATE canciones SET letra_cacnion = '{
  "es": "El sol sale y todo el mundo pide más luz ahora",
  "en": "The sun rises and everyone begs for more golden light today",
  "ja": "太陽が昇り、皆がもっと光を求めて叫んでいる"
}'::jsonb WHERE id = 5;

-- 6. In the End (id=6)
UPDATE canciones SET letra_cacnion = '{
  "es": "Al final no importa cuánto lo intenté, fue en vano",
  "en": "In the end it does not matter how hard I tried here",
  "ja": "結局どれだけ頑張っても何も変わらなかった"
}'::jsonb WHERE id = 6;

-- 7. Yellow (id=7)
UPDATE canciones SET letra_cacnion = '{
  "es": "Mira las estrellas, brillan solo para ti esta noche",
  "en": "Look at the stars and see how they shine just for you",
  "ja": "星を見て、君のためだけに輝いているのがわかる"
}'::jsonb WHERE id = 7;

-- 8. Rolling in the Deep (id=8)
UPDATE canciones SET letra_cacnion = '{
  "es": "Podríamos haberlo tenido todo, rodando en lo profundo juntos",
  "en": "We could have had it all rolling in the deep together always",
  "ja": "私たちはすべてを手に入れられた、深みの中で転がりながら"
}'::jsonb WHERE id = 8;

-- 9. Locked Out of Heaven (id=9)
UPDATE canciones SET letra_cacnion = '{
  "es": "Me dejaste fuera del cielo que tú misma habías creado",
  "en": "You locked me out of the heaven that you created for yourself",
  "ja": "君が作った天国から締め出されてしまった"
}'::jsonb WHERE id = 9;

-- 10. Without Me (id=10)
UPDATE canciones SET letra_cacnion = '{
  "es": "Dos pequeños niños en el parque, sin mí no hay show",
  "en": "Two little kids in the park without me there is no show",
  "ja": "公園の二人の子供たち、俺なしじゃショーは成り立たない"
}'::jsonb WHERE id = 10;

-- 11. Estoy Aquí (id=11)
UPDATE canciones SET letra_cacnion = '{
  "es": "Estoy aquí esperando que vuelvas, no me olvides mi amor",
  "en": "I am here waiting for you to come back, please do not forget",
  "ja": "ここで君の帰りを待っている、忘れないでほしい"
}'::jsonb WHERE id = 11;

-- 12. Get Lucky (id=12)
UPDATE canciones SET letra_cacnion = '{
  "es": "Seguimos bailando para llegar a tener suerte esta noche",
  "en": "We keep on dancing through the night trying to get lucky now",
  "ja": "今夜は運を手に入れるために踊り続けよう"
}'::jsonb WHERE id = 12;

-- 13. Bad Guy (id=13)
UPDATE canciones SET letra_cacnion = '{
  "es": "Soy el chico malo, el que nunca obedece las reglas",
  "en": "I am the bad guy, the one who never follows any rules ever",
  "ja": "俺が悪い奴、ルールなんて一切守らないやつだ"
}'::jsonb WHERE id = 13;

-- 14. Vivir Mi Vida (id=14)
UPDATE canciones SET letra_cacnion = '{
  "es": "Voy a reír, voy a bailar y vivir mi vida lalá",
  "en": "I will laugh, I will dance and live my life so happily",
  "ja": "笑って、踊って、自分の人生を楽しく生きていく"
}'::jsonb WHERE id = 14;

-- 15 & 16. On Melancholy Hill (ids=15,16)
UPDATE canciones SET letra_cacnion = '{
  "es": "En la colina melancólica te espero mirando el mar azul",
  "en": "On melancholy hill I wait for you watching the distant blue sea",
  "ja": "憂鬱な丘の上で、遠い海を眺めながら君を待っている"
}'::jsonb WHERE id IN (15, 16);

-- 17. Strobelite (id=17)
UPDATE canciones SET letra_cacnion = '{
  "es": "La luz estroboscópica ilumina toda la pista de baile entera",
  "en": "The strobelight lights up the entire dance floor on this night",
  "ja": "ストロボライトがダンスフロア全体を照らし出している"
}'::jsonb WHERE id = 17;

